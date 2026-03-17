import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { TeacherRole } from '../teacher/enums/teacher-role.enum';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { AddStudentDto } from './dto/add-student.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TeacherRole.ADMIN)
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  create(@Body() dto: CreateParentDto) {
    return this.parentsService.create(dto);
  }

  @Post(':id/students')
  addStudent(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: AddStudentDto,
  ) {
    return this.parentsService.addStudent(id, dto);
  }

  @Get()
  findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.parentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.parentsService.softDelete(id);
  }
}
