import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import ParentSchema from '../telegram/schemas/parent.schema';
import StudentSchema from '../../components/student/schemas/student.schema';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Parent', schema: ParentSchema },
      { name: 'Student', schema: StudentSchema },
    ]),
  ],
  providers: [ParentsService],
  controllers: [ParentsController],
  exports: [ParentsService],
})
export class ParentsModule {}
