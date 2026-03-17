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

    const uzDays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const dayName = uzDays[dayjs(date).day()];

    const lines: string[] = [
      `📋 *${student.firstName} ${student.lastName}* — Kunlik Davomat`,
      `📅 ${dayName}, ${dayjs(date).format('DD.MM.YYYY')}`,
      `─────────────────────`,
    ];

    if (!schedules.length) {
      lines.push('📭 Bugun dars jadvali mavjud emas.');
      return lines.join('\n');
    }

    for (const schedule of schedules) {
      const subjectName = (schedule.subjectId as any)?.name ?? 'Noma\'lum fan';

      const session = await this.sessionModel.findOne({
        classId: student.classId,
        subjectId: schedule.subjectId,
        date,
        period: schedule.period,
      }).lean() as any;

      if (!session) {
        lines.push(`📚 ${subjectName} — ⚠️ Davomat olinmagan`);
        continue;
      }

      const record = await this.attendanceModel.findOne({
        sessionId: session._id,
        studentId: student._id,
      }).lean() as any;

      if (!record) {
        lines.push(`📚 ${subjectName} — ⚠️ Davomat olinmagan`);
        continue;
      }

      const statusLabel: Record<string, string> = {
        PRESENT: '✅ Keldi',
        ABSENT:  '❌ Kelmadi',
        LATE:    '⏰ Kech keldi',
      };

      lines.push(`📚 ${subjectName} — ${statusLabel[record.status] ?? record.status}`);
    }

    lines.push(`─────────────────────`);
    return lines.join('\n');
  }
}
