import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateParentDto } from './dto/create-parent.dto';
import { AddStudentDto } from './dto/add-student.dto';

@Injectable()
export class ParentsService {
  constructor(
    @InjectModel('Parent') private readonly parentModel: Model<any>,
    @InjectModel('Student') private readonly studentModel: Model<any>,
  ) {}

  async create(dto: CreateParentDto) {
    const student = await this.studentModel
      .findOne({ connectCode: dto.connectCode.toUpperCase(), isActive: true })
      .lean() as any;

    if (!student) {
      throw new NotFoundException(`No student found with connect code "${dto.connectCode}"`);
    }

    const existing = await this.parentModel.findOne({ phone: dto.phone }).lean() as any;
    if (existing) {
      // Parent exists — just link the student if not already linked
      const alreadyLinked = existing.studentIds.some(
        (id: any) => id.toString() === student._id.toString(),
      );
      if (alreadyLinked) {
        throw new ConflictException('This parent is already linked to this student');
      }
      await this.parentModel.updateOne(
        { _id: existing._id },
        { $push: { studentIds: student._id } },
      );
      await this.studentModel.updateOne(
        { _id: student._id },
        { $addToSet: { parentIds: existing._id } },
      );
      return this.parentModel.findById(existing._id).populate('studentIds', 'firstName lastName connectCode').lean();
    }

    // Create new parent
    const parent = await this.parentModel.create({
      fullName: dto.fullName,
      phone: dto.phone,
      studentIds: [student._id],
    });

    await this.studentModel.updateOne(
      { _id: student._id },
      { $addToSet: { parentIds: parent._id } },
    );

    return this.parentModel.findById(parent._id).populate('studentIds', 'firstName lastName connectCode').lean();
  }

  async addStudent(parentId: string, dto: AddStudentDto) {
    if (!Types.ObjectId.isValid(parentId)) throw new NotFoundException('Parent not found');

    const parent = await this.parentModel.findById(parentId).lean() as any;
    if (!parent) throw new NotFoundException('Parent not found');

    const student = await this.studentModel
      .findOne({ connectCode: dto.connectCode.toUpperCase(), isActive: true })
      .lean() as any;
    if (!student) throw new NotFoundException(`No student found with connect code "${dto.connectCode}"`);

    const alreadyLinked = parent.studentIds.some(
      (id: any) => id.toString() === student._id.toString(),
    );
    if (alreadyLinked) throw new ConflictException('Already linked to this student');

    await this.parentModel.updateOne(
      { _id: parentId },
      { $push: { studentIds: student._id } },
    );
    await this.studentModel.updateOne(
      { _id: student._id },
      { $addToSet: { parentIds: parent._id } },
    );

    return this.parentModel.findById(parentId).populate('studentIds', 'firstName lastName connectCode').lean();
  }

  async findAll() {
    return this.parentModel
      .find({ isActive: true })
      .populate('studentIds', 'firstName lastName connectCode')
      .lean();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Parent not found');
    const parent = await this.parentModel
      .findById(id)
      .populate('studentIds', 'firstName lastName connectCode classId')
      .lean();
    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  }

  async softDelete(id: string) {
    const parent = await this.parentModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .lean();
    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  }
}
