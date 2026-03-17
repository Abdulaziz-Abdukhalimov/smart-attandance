import { IsNotEmpty, IsString } from 'class-validator';

export class AddStudentDto {
  @IsString()
  @IsNotEmpty()
  connectCode: string;
}
