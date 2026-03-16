import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import dayjs from 'dayjs';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel('Schedule') private readonly scheduleModel: Model<any>,
  ) {}

  async create(dto: CreateScheduleDto, schoolId: string) {
    return this.scheduleModel.create({ ...dto, schoolId });
  }

  async findAll(schoolId: string) {
    return this.scheduleModel
      .find({ schoolId, isActive: true })
      .populate('teacherId', 'fullName email')
      .populate('classId', 'name grade section')
      .populate('subjectId', 'name')
      .lean();
  }

  async findOne(id: string, schoolId: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Schedule not found');
    const schedule = await this.scheduleModel
      .findOne({ _id: id, schoolId })
      .populate('teacherId', 'fullName email')
      .populate('classId', 'name grade section')
      .populate('subjectId', 'name')
      .lean();
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async findTeacherDailySchedule(teacherId: string, schoolId: string) {
    // Convert JS getDay() (0=Sun,1=Mon...) to our DayOfWeek enum (1=Mon..7=Sun)
    const jsDay = dayjs().day(); // 0 = Sunday
    const weekday = jsDay === 0 ? 7 : jsDay;

    return this.scheduleModel
      .find({ teacherId, schoolId, weekday, isActive: true })
      .populate('classId', 'name grade section')
      .populate('subjectId', 'name')
      .sort({ period: 1 })
      .lean();
  }

  async findByTeacher(teacherId: string, schoolId: string, weekday?: number) {
    const filter: any = { teacherId, schoolId, isActive: true };
    if (weekday) filter.weekday = weekday;
    return this.scheduleModel
      .find(filter)
      .populate('classId', 'name grade section')
      .populate('subjectId', 'name')
      .sort({ weekday: 1, period: 1 })
      .lean();
  }

  async update(id: string, dto: UpdateScheduleDto, schoolId: string) {
    const schedule = await this.scheduleModel
      .findOneAndUpdate({ _id: id, schoolId }, dto, { new: true })
      .lean();
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async softDelete(id: string, schoolId: string) {
    const schedule = await this.scheduleModel
      .findOneAndUpdate({ _id: id, schoolId }, { isActive: false }, { new: true })
      .lean();
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }
}
