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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SchoolId } from '../../common/decorators/school-id.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { TeacherRole } from '../../modules/teacher/enums/teacher-role.enum';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Roles(TeacherRole.ADMIN)
  @Post()
  create(@Body() dto: CreateScheduleDto, @SchoolId() schoolId: string) {
    return this.scheduleService.create(dto, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Get()
  findAll(@SchoolId() schoolId: string) {
    return this.scheduleService.findAll(schoolId);
  }

  @Get('my/today')
  getMyTodaySchedule(
    @CurrentUser('userId') teacherId: string,
    @SchoolId() schoolId: string,
  ) {
    return this.scheduleService.findTeacherDailySchedule(teacherId, schoolId);
  }

  @Get('my/weekly')
  getMyWeeklySchedule(
    @CurrentUser('userId') teacherId: string,
    @SchoolId() schoolId: string,
    @Query('weekday') weekday?: string,
  ) {
    return this.scheduleService.findByTeacher(
      teacherId,
      schoolId,
      weekday ? Number(weekday) : undefined,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.scheduleService.findOne(id, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateScheduleDto,
    @SchoolId() schoolId: string,
  ) {
    return this.scheduleService.update(id, dto, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @SchoolId() schoolId: string,
  ) {
    return this.scheduleService.softDelete(id, schoolId);
  }
}
