import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import AttendanceSessionSchema from './schemas/attendance-session.schema';
import AttendanceSchema from './schemas/attendance.schema';
import ScheduleSchema from '../schedule/schemas/schedule.schema';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AttendanceSession', schema: AttendanceSessionSchema },
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'Schedule', schema: ScheduleSchema },
    ]),
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}
