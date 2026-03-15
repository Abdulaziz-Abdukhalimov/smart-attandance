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

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherService } from './teacher.service';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() dto: CreateTeacherDto, @SchoolId() schoolId: string) {
    return this.teacherService.create(dto, schoolId);
  }

  @Get()
  findAll(@SchoolId() schoolId: string) {
    return this.teacherService.findAll(schoolId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.teacherService.findOne(id, schoolId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTeacherDto,
    @SchoolId() schoolId: string,
  ) {
    return this.teacherService.update(id, dto, schoolId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.teacherService.softDelete(id, schoolId);
  }
}
