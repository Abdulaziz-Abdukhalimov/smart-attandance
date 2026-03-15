import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import TeacherSchema from './schemas/teacher.schema';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
  ],
  providers: [TeacherService],
  controllers: [TeacherController],
  exports: [TeacherService],
})
export class TeacherModule {}
