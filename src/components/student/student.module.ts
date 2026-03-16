import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import StudentSchema from './schemas/student.schema';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
