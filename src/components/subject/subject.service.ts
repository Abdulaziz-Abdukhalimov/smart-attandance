import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel('Subject') private readonly subjectModel: Model<any>,
  ) {}

  async create(dto: CreateSubjectDto, schoolId: string) {
    return this.subjectModel.create({ ...dto, schoolId });
  }

  async findAll(schoolId: string) {
    return this.subjectModel.find({ schoolId, isActive: true }).lean();
  }

  async findOne(id: string, schoolId: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Subject not found');
    const subject = await this.subjectModel.findOne({ _id: id, schoolId }).lean();
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async update(id: string, dto: UpdateSubjectDto, schoolId: string) {
    const subject = await this.subjectModel
      .findOneAndUpdate({ _id: id, schoolId }, dto, { new: true })
      .lean();
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async softDelete(id: string, schoolId: string) {
    const subject = await this.subjectModel
      .findOneAndUpdate({ _id: id, schoolId }, { isActive: false }, { new: true })
      .lean();
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }
}
