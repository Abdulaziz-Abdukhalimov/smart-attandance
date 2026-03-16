import { Schema } from 'mongoose';
import { DayOfWeek } from '../../../libs/enums/schedule.enum';

const ScheduleSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Teacher',
    },
    classId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Class',
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Subject',
    },
    weekday: {
      type: Number,
      enum: Object.values(DayOfWeek),
      required: true,
    },
    period: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'schedules' },
);

ScheduleSchema.index({ schoolId: 1, weekday: 1, period: 1, classId: 1 }, { unique: true });
ScheduleSchema.index({ schoolId: 1, teacherId: 1, weekday: 1 });
ScheduleSchema.index({ teacherId: 1, weekday: 1 });

export default ScheduleSchema;
