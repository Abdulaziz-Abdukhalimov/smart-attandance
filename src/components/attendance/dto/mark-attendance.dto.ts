import { IsArray, IsEnum, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../../libs/enums/schedule.enum';

export class StudentAttendanceEntry {
  @IsMongoId()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class MarkAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceEntry)
  records: StudentAttendanceEntry[];
}
