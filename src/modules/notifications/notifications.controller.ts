import { Controller, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TeacherRole } from '../teacher/enums/teacher-role.enum';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles(TeacherRole.ADMIN, TeacherRole.SUPER_ADMIN)
  @Post('send-daily')
  @HttpCode(HttpStatus.OK)
  sendDaily(@Query('date') date?: string) {
    return this.notificationsService.sendDailySummaries(date);
  }
}
