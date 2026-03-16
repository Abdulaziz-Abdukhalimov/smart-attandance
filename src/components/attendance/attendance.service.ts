import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import dayjs from 'dayjs';

import { OpenSessionDto } from './dto/open-session.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

const EDIT_WINDOW_MINUTES = 45;

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel('AttendanceSession')
    private readonly sessionModel: Model<any>,
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<any>,
    @InjectModel('Schedule')
    private readonly scheduleModel: Model<any>,
  ) {}

  async openSession(dto: OpenSessionDto, teacherId: string, schoolId: string) {
    const schedule = await this.scheduleModel
      .findOne({ _id: dto.scheduleId, teacherId, schoolId, isActive: true })
      .lean();
    if (!schedule) throw new NotFoundException('Schedule not found');

    const today = dayjs().format('YYYY-MM-DD');

    const existing = await this.sessionModel.findOne({
      schoolId,
      date: today,
      classId: schedule.classId,
      period: schedule.period,
    });
    if (existing) throw new BadRequestException('Session already opened for this lesson today');

    return this.sessionModel.create({
      schoolId,
      scheduleId: schedule._id,
      teacherId,
      classId: schedule.classId,
      subjectId: schedule.subjectId,
      date: today,
      period: schedule.period,
      openedAt: new Date(),
    });
  }

  async markAttendance(
    sessionId: string,
    dto: MarkAttendanceDto,
    teacherId: string,
    schoolId: string,
  ) {
    if (!Types.ObjectId.isValid(sessionId))
      throw new NotFoundException('Session not found');

    const session = await this.sessionModel
      .findOne({ _id: sessionId, teacherId, schoolId })
      .lean();
    if (!session) throw new NotFoundException('Session not found');

    this.assertEditWindowOpen(session.openedAt);

    const ops = dto.records.map((r) => ({
      updateOne: {
        filter: { sessionId: session._id, studentId: r.studentId },
        update: {
          $set: {
            sessionId: session._id,
            schoolId,
            studentId: r.studentId,
            teacherId,
            classId: session.classId,
            subjectId: session.subjectId,
            date: session.date,
            period: session.period,
            status: r.status,
          },
        },
        upsert: true,
      },
    }));

    await this.attendanceModel.bulkWrite(ops);
    return this.attendanceModel.find({ sessionId: session._id }).lean();
  }

  async updateSingleRecord(
    attendanceId: string,
    dto: UpdateAttendanceDto,
    teacherId: string,
    schoolId: string,
  ) {
    if (!Types.ObjectId.isValid(attendanceId))
      throw new NotFoundException('Attendance record not found');

    const record = await this.attendanceModel
      .findOne({ _id: attendanceId, teacherId, schoolId })
      .lean();
    if (!record) throw new NotFoundException('Attendance record not found');

    const session = await this.sessionModel
      .findOne({ _id: record.sessionId })
      .lean();
    if (!session) throw new NotFoundException('Session not found');

    this.assertEditWindowOpen(session.openedAt);

    return this.attendanceModel
      .findByIdAndUpdate(attendanceId, { status: dto.status }, { new: true })
      .lean();
  }

  async getSessionAttendance(sessionId: string, schoolId: string) {
    if (!Types.ObjectId.isValid(sessionId))
      throw new NotFoundException('Session not found');
    return this.attendanceModel
      .find({ sessionId, schoolId })
      .populate('studentId', 'firstName lastName')
      .lean();
  }

  async getTeacherSessions(teacherId: string, schoolId: string, date?: string) {
    const filter: any = { teacherId, schoolId };
    if (date) filter.date = date;
    else filter.date = dayjs().format('YYYY-MM-DD');

    return this.sessionModel
      .find(filter)
      .populate('classId', 'name grade section')
      .populate('subjectId', 'name')
      .lean();
  }

  async getStudentAttendance(studentId: string, schoolId: string, date?: string) {
    const filter: any = { studentId, schoolId };
    if (date) filter.date = date;
    return this.attendanceModel
      .find(filter)
      .populate('subjectId', 'name')
      .sort({ date: -1 })
      .lean();
  }

  async getDailySummaryForStudent(studentId: string, date: string) {
    return this.attendanceModel
      .find({ studentId, date })
      .populate('subjectId', 'name')
      .lean();
  }

  private assertEditWindowOpen(openedAt: Date) {
    const minutesElapsed = dayjs().diff(dayjs(openedAt), 'minute');
    if (minutesElapsed > EDIT_WINDOW_MINUTES) {
      throw new ForbiddenException(
        `Attendance can only be edited within ${EDIT_WINDOW_MINUTES} minutes of lesson start`,
      );
    }
  }
}
