import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SchoolId } from '../../common/decorators/school-id.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { TeacherRole } from '../../modules/teacher/enums/teacher-role.enum';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Roles(TeacherRole.ADMIN)
  @Post()
  create(@Body() dto: CreateSubjectDto, @SchoolId() schoolId: string) {
    return this.subjectService.create(dto, schoolId);
  }

  @Get()
  findAll(@SchoolId() schoolId: string) {
    return this.subjectService.findAll(schoolId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.subjectService.findOne(id, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateSubjectDto,
    @SchoolId() schoolId: string,
  ) {
    return this.subjectService.update(id, dto, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.subjectService.softDelete(id, schoolId);
  }
}
