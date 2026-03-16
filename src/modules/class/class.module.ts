import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import ClassSchema from './schemas/class.schema';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
