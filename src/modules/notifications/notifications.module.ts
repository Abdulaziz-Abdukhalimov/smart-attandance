import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsService } from './notifications.service';
import DailySummaryLogSchema from './schemas/daily-summary-log.schema';
import StudentSchema from '../../components/student/schemas/student.schema';
import AttendanceSchema from '../../components/attendance/schemas/attendance.schema';
import AttendanceSessionSchema from '../../components/attendance/schemas/attendance-session.schema';
import ScheduleSchema from '../../components/schedule/schemas/schedule.schema';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TelegramModule,
    MongooseModule.forFeature([
      { name: 'DailySummaryLog', schema: DailySummaryLogSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'AttendanceSession', schema: AttendanceSessionSchema },
      { name: 'Schedule', schema: ScheduleSchema },
    ]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
