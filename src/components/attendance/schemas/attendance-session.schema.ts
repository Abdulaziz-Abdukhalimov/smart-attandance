import { Schema } from 'mongoose';

const AttendanceSessionSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Schedule',
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
    date: {
      type: String,
      required: true,
    },
    period: {
      type: Number,
      required: true,
    },
    openedAt: {
      type: Date,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: 'attendance_sessions' },
);

AttendanceSessionSchema.index({ schoolId: 1, date: 1, classId: 1, period: 1 }, { unique: true });
AttendanceSessionSchema.index({ teacherId: 1, date: 1 });
AttendanceSessionSchema.index({ schoolId: 1, date: 1 });

export default AttendanceSessionSchema;
