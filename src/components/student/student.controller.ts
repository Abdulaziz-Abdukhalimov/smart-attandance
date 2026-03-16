import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SchoolId } from '../../common/decorators/school-id.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { TeacherRole } from '../../modules/teacher/enums/teacher-role.enum';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Roles(TeacherRole.ADMIN)
  @Post()
  create(@Body() dto: CreateStudentDto, @SchoolId() schoolId: string) {
    return this.studentService.create(dto, schoolId);
  }

  @Get()
  findAll(@SchoolId() schoolId: string, @Query('classId') classId?: string) {
    return this.studentService.findAll(schoolId, classId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.studentService.findOne(id, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateStudentDto,
    @SchoolId() schoolId: string,
  ) {
    return this.studentService.update(id, dto, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.studentService.softDelete(id, schoolId);
  }
}
