import { IsEnum } from 'class-validator';
import { AttendanceStatus } from '../../../libs/enums/schedule.enum';

export class UpdateAttendanceDto {
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
