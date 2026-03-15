import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

export type SchoolDocument = any;

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel('School')
    private readonly schoolModel: Model<SchoolDocument>,
  ) {}

  async create(createDto: CreateSchoolDto) {
    const created = new this.schoolModel(createDto);
    return created.save();
  }

  async findAll() {
    return this.schoolModel.find({}).lean();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('School not found');
    }
    const school = await this.schoolModel.findById(id).lean();
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }

  async update(id: string, updateDto: UpdateSchoolDto) {
    const school = await this.schoolModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .lean();
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }

  async softDelete(id: string) {
    const school = await this.schoolModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .lean();
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }
}
