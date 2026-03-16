import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DayOfWeek } from '../../../libs/enums/schedule.enum';

export class CreateScheduleDto {
  @IsMongoId()
  teacherId: string;

  @IsMongoId()
  classId: string;

  @IsMongoId()
  subjectId: string;

  @IsEnum(DayOfWeek)
  weekday: DayOfWeek;

  @IsNumber()
  @Min(1)
  @Max(10)
  period: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}
