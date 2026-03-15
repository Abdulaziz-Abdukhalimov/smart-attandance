import { IsOptional, IsString } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';
import { PartialType } from '@nestjs/graphql';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  @IsOptional()
  @IsString()
  password?: string;
}
