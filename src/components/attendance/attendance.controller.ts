import {
  Body,
  Controller,
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
import { AttendanceService } from './attendance.service';
import { OpenSessionDto } from './dto/open-session.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles(TeacherRole.TEACHER, TeacherRole.ADMIN)
  @Post('sessions')
  openSession(
    @Body() dto: OpenSessionDto,
    @CurrentUser('userId') teacherId: string,
    @SchoolId() schoolId: string,
  ) {
    return this.attendanceService.openSession(dto, teacherId, schoolId);
  }

  @Roles(TeacherRole.TEACHER, TeacherRole.ADMIN)
  @Get('sessions')
  getMySessions(
    @CurrentUser('userId') teacherId: string,
    @SchoolId() schoolId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getTeacherSessions(teacherId, schoolId, date);
  }

  @Roles(TeacherRole.TEACHER, TeacherRole.ADMIN)
  @Post('sessions/:sessionId/mark')
  markAttendance(
    @Param('sessionId', ParseObjectIdPipe) sessionId: string,
    @Body() dto: MarkAttendanceDto,
    @CurrentUser('userId') teacherId: string,
    @SchoolId() schoolId: string,
  ) {
    return this.attendanceService.markAttendance(sessionId, dto, teacherId, schoolId);
  }

  @Roles(TeacherRole.TEACHER, TeacherRole.ADMIN)
  @Patch(':attendanceId')
  updateRecord(
    @Param('attendanceId', ParseObjectIdPipe) attendanceId: string,
    @Body() dto: UpdateAttendanceDto,
    @CurrentUser('userId') teacherId: string,
    @SchoolId() schoolId: string,
  ) {
    return this.attendanceService.updateSingleRecord(attendanceId, dto, teacherId, schoolId);
  }

  @Get('sessions/:sessionId')
  getSessionAttendance(
    @Param('sessionId', ParseObjectIdPipe) sessionId: string,
    @SchoolId() schoolId: string,
  ) {
    return this.attendanceService.getSessionAttendance(sessionId, schoolId);
  }

  @Roles(TeacherRole.ADMIN)
  @Get('students/:studentId')
  getStudentAttendance(
    @Param('studentId', ParseObjectIdPipe) studentId: string,
    @SchoolId() schoolId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, schoolId, date);
  }
}
