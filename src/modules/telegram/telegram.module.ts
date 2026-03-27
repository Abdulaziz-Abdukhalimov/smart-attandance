import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import ParentSchema from './schemas/parent.schema';
import StudentSchema from '../../components/student/schemas/student.schema';
import AttendanceSchema from '../../components/attendance/schemas/attendance.schema';
import AttendanceSessionSchema from '../../components/attendance/schemas/attendance-session.schema';
import ScheduleSchema from '../../components/schedule/schemas/schedule.schema';
import { TelegramService } from './telegram.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Parent', schema: ParentSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'AttendanceSession', schema: AttendanceSessionSchema },
      { name: 'Schedule', schema: ScheduleSchema },
    ]),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
