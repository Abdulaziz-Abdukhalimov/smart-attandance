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
    periodNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    openedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: 'attendance_sessions' },
);

AttendanceSessionSchema.index({ schoolId: 1 });
AttendanceSessionSchema.index({ schoolId: 1, date: 1 });
AttendanceSessionSchema.index({ schoolId: 1, teacherId: 1, date: 1 });
AttendanceSessionSchema.index({ schoolId: 1, classId: 1, date: 1 });
AttendanceSessionSchema.index({ scheduleId: 1, date: 1 }, { unique: true });

export default AttendanceSessionSchema;
