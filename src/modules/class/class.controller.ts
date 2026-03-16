import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { SchoolId } from '../../common/decorators/school-id.decorator';

import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassService } from './class.service';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  create(@Body() dto: CreateClassDto, @SchoolId() schoolId: string) {
    return this.classService.create(dto, schoolId);
  }

  @Get()
  findAll(@SchoolId() schoolId: string) {
    return this.classService.findAll(schoolId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.classService.findOne(id, schoolId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateClassDto,
    @SchoolId() schoolId: string,
  ) {
    return this.classService.update(id, dto, schoolId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.classService.softDelete(id, schoolId);
  }
}
