import { IsMongoId } from 'class-validator';

export class OpenSessionDto {
  @IsMongoId()
  scheduleId: string;
}
