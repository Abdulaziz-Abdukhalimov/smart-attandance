import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import ParentSchema from './schemas/parent.schema';
import StudentSchema from '../../components/student/schemas/student.schema';
import { TelegramService } from './telegram.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Parent', schema: ParentSchema },
      { name: 'Student', schema: StudentSchema },
    ]),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
