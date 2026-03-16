import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student') private readonly studentModel: Model<any>,
  ) {}

  async create(dto: CreateStudentDto, schoolId: string) {
    const connectCode = uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase();
    return this.studentModel.create({ ...dto, schoolId, connectCode });
  }

  async findAll(schoolId: string, classId?: string) {
    const filter: any = { schoolId, isActive: true };
    if (classId) filter.classId = classId;
    return this.studentModel.find(filter).populate('classId', 'name grade section').lean();
  }

  async findOne(id: string, schoolId: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Student not found');
    const student = await this.studentModel
      .findOne({ _id: id, schoolId })
      .populate('classId', 'name grade section')
      .lean();
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, dto: UpdateStudentDto, schoolId: string) {
    const student = await this.studentModel
      .findOneAndUpdate({ _id: id, schoolId }, dto, { new: true })
      .lean();
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async softDelete(id: string, schoolId: string) {
    const student = await this.studentModel
      .findOneAndUpdate({ _id: id, schoolId }, { isActive: false }, { new: true })
      .lean();
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async findByConnectCode(connectCode: string) {
    return this.studentModel.findOne({ connectCode, isActive: true }).lean();
  }
}
