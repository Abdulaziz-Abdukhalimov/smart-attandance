import { registerEnumType } from '@nestjs/graphql';

export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}
registerEnumType(DayOfWeek, {
  name: 'DayOfWeek',
});

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

registerEnumType(AttendanceStatus, {
  name: 'AttendanceStatus',
});
