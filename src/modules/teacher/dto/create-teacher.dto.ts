import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TeacherRole } from '../enums/teacher-role.enum';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(TeacherRole)
  role?: TeacherRole;
}
