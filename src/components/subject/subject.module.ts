import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import SubjectSchema from './schemas/subject.schema';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
  ],
  providers: [SubjectService],
  controllers: [SubjectController],
  exports: [SubjectService],
})
export class SubjectModule {}
