import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './components/auth/auth.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { StudentModule } from './components/student/student.module';
import { ScheduleModule } from './components/schedule/schedule.module';
import { AttendanceModule } from './components/attendance/attendance.module';
import { SchoolModule } from './modules/school/school.module';
import { ClassModule } from './components/class/class.module';
import { SubjectModule } from './components/subject/subject.module';
import { DatabaseModule } from './database/database/database.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    TeacherModule,
    StudentModule,
    ScheduleModule,
    AttendanceModule,
    SchoolModule,
    ClassModule,
    SubjectModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
