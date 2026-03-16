import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database/database.module';

// Feature modules
import { AuthModule } from './components/auth/auth.module';
import { SchoolModule } from './modules/school/school.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ClassModule } from './modules/class/class.module';
import { SubjectModule } from './components/subject/subject.module';
import { StudentModule } from './components/student/student.module';
import { ScheduleModule } from './components/schedule/schedule.module';
import { AttendanceModule } from './components/attendance/attendance.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// Global guards
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    SchoolModule,
    TeacherModule,
    ClassModule,
    SubjectModule,
    StudentModule,
    ScheduleModule,
    AttendanceModule,
    TelegramModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
