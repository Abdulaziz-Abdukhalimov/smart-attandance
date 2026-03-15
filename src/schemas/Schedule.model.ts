import { Schema } from 'mongoose';
import { DayOfWeek } from 'src/libs/enums/schedule.enum';

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
    dayOfWeek: {
      type: Number,
      enum: Object.values(DayOfWeek).filter((v) => typeof v === 'number'),
      required: true,
    },
    periodNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'schedules' },
);

ScheduleSchema.index({ schoolId: 1 });
ScheduleSchema.index({ schoolId: 1, teacherId: 1, dayOfWeek: 1 });
ScheduleSchema.index({ schoolId: 1, classId: 1, dayOfWeek: 1 });
ScheduleSchema.index(
  { schoolId: 1, classId: 1, subjectId: 1, dayOfWeek: 1, periodNumber: 1 },
  { unique: true },
);

export default ScheduleSchema;
