import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

export type TeacherDocument = any;

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel('Teacher')
    private readonly teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createDto: CreateTeacherDto, schoolId: string) {
    const passwordHash = await bcrypt.hash(createDto.password, 10);
    const created = new this.teacherModel({
      ...createDto,
      passwordHash,
      schoolId,
    });
    return created.save();
  }

  async findAll(schoolId: string) {
    return this.teacherModel.find({ schoolId }).lean();
  }

  async findOne(id: string, schoolId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Teacher not found');
    }
    const teacher = await this.teacherModel
      .findOne({ _id: id, schoolId })
      .lean();
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async update(id: string, updateDto: UpdateTeacherDto, schoolId: string) {
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
      delete updateDto.password;
    }
    const teacher = await this.teacherModel
      .findOneAndUpdate({ _id: id, schoolId }, updateDto, { new: true })
      .lean();
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async softDelete(id: string, schoolId: string) {
    const teacher = await this.teacherModel
      .findOneAndUpdate(
        { _id: id, schoolId },
        { isActive: false },
        { new: true },
      )
      .lean();
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async findByEmail(email: string, schoolId: string) {
    return this.teacherModel.findOne({ email, schoolId }).lean();
  }
}
