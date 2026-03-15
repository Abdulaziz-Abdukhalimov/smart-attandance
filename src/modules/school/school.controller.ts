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

import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolService } from './school.service';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  create(@Body() dto: CreateSchoolDto) {
    return this.schoolService.create(dto);
  }

  @Get()
  findAll() {
    return this.schoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.schoolService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.schoolService.softDelete(id);
  }
}
