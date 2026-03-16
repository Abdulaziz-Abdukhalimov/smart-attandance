import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

export type ClassDocument = any;

@Injectable()
export class ClassService {
  constructor(
    @InjectModel('Class')
    private readonly classModel: Model<ClassDocument>,
  ) {}

  async create(createDto: CreateClassDto, schoolId: string) {
    const created = new this.classModel({
      ...createDto,
      schoolId,
    });
    return created.save();
  }

  async findAll(schoolId: string) {
    return this.classModel.find({ schoolId }).lean();
  }

  async findOne(id: string, schoolId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Class not found');
    }
    const cls = await this.classModel.findOne({ _id: id, schoolId }).lean();
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    return cls;
  }

  async update(id: string, updateDto: UpdateClassDto, schoolId: string) {
    const cls = await this.classModel
      .findOneAndUpdate({ _id: id, schoolId }, updateDto, { new: true })
      .lean();
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    return cls;
  }

  async softDelete(id: string, schoolId: string) {
    const cls = await this.classModel
      .findOneAndUpdate({ _id: id, schoolId }, { isActive: false }, { new: true })
      .lean();
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    return cls;
  }
}