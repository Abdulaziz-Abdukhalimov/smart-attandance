import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import dayjs from 'dayjs';

import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel('Student') private readonly studentModel: Model<any>,
    @InjectModel('Attendance') private readonly attendanceModel: Model<any>,
    @InjectModel('AttendanceSession') private readonly sessionModel: Model<any>,
    @InjectModel('Schedule') private readonly scheduleModel: Model<any>,
    @InjectModel('DailySummaryLog') private readonly summaryLogModel: Model<any>,
    private readonly telegramService: TelegramService,
  ) {
    this.registerCronJob();
  }

  private registerCronJob() {
    // Runs every day at 16:00
    cron.schedule('0 16 * * *', async () => {
      this.logger.log('Starting daily attendance summary cron job');
      await this.sendDailySummaries();
    });
  }

  async sendDailySummaries(date?: string): Promise<void> {
    const targetDate = date ?? dayjs().format('YYYY-MM-DD');
    this.logger.log(`Sending daily summaries for date: ${targetDate}`);

    const students = await this.studentModel.find({ isActive: true }).lean() as any[];

    for (const student of students) {
      await this.processSingleStudent(student, targetDate);
    }

    this.logger.log(`Daily summaries completed for ${targetDate}`);
  }

  private async processSingleStudent(student: any, date: string): Promise<void> {
    try {
      const alreadySent = await this.summaryLogModel.findOne({
        studentId: student._id,
        date,
        sent: true,
      });
      if (alreadySent) return;

      const parents = await this.telegramService.getParentsForStudent(
        student._id.toString(),
      ) as any[];

      if (!parents.length) return;

      const message = await this.buildSummaryMessage(student, date);

      for (const parent of parents) {
        await this.telegramService.sendMessage(parent.telegramChatId, message);
      }

      await this.summaryLogModel.findOneAndUpdate(
        { studentId: student._id, date },
        { sent: true, sentAt: new Date() },
        { upsert: true, new: true },
      );
    } catch (err) {
      this.logger.error(
        `Failed to send summary for student ${student._id}: ${err.message}`,
      );
      await this.summaryLogModel.findOneAndUpdate(
        { studentId: student._id, date },
        { sent: false, errorMessage: err.message },
        { upsert: true, new: true },
      );
    }
  }

  private async buildSummaryMessage(student: any, date: string): Promise<string> {
    // Get all schedules that should have been for this student's class today
    const jsDay = dayjs(date).day();
    const weekday = jsDay === 0 ? 7 : jsDay;

    const schedules = await this.scheduleModel
      .find({ classId: student.classId, weekday, isActive: true })
      .populate('subjectId', 'name')
      .sort({ period: 1 })
      .lean() as any[];

    const lines: string[] = [
      `📋 *${student.firstName} ${student.lastName}* — Daily Attendance`,
      `📅 ${dayjs(date).format('DD MMM YYYY')}`,
      '',
    ];

    if (!schedules.length) {
      lines.push('No lessons scheduled for today.');
      return lines.join('\n');
    }

    for (const schedule of schedules) {
      const subjectName = (schedule.subjectId as any)?.name ?? 'Unknown';

      const session = await this.sessionModel.findOne({
        classId: student.classId,
        subjectId: schedule.subjectId,
        date,
        period: schedule.period,
      }).lean() as any;

      if (!session) {
        lines.push(`📚 ${subjectName} — ⚠️ Attendance not recorded`);
        continue;
      }

      const record = await this.attendanceModel.findOne({
        sessionId: session._id,
        studentId: student._id,
      }).lean() as any;

      if (!record) {
        lines.push(`📚 ${subjectName} — ⚠️ Attendance not recorded`);
        continue;
      }

      const statusEmoji: Record<string, string> = {
        PRESENT: '✅',
        ABSENT: '❌',
        LATE: '⏰',
      };

      const emoji = statusEmoji[record.status] ?? '❓';
      lines.push(`📚 ${subjectName} — ${emoji} ${record.status}`);
    }

    return lines.join('\n');
  }
}
