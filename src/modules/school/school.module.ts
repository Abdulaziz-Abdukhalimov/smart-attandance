import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import SchoolSchema from './schemas/school.schema';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'School', schema: SchoolSchema }]),
  ],
  providers: [SchoolService],
  controllers: [SchoolController],
  exports: [SchoolService],
})
export class SchoolModule {}
