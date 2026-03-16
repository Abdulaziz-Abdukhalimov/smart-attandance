import { Schema } from 'mongoose';
import { AttendanceStatus } from '../../../libs/enums/schedule.enum';

const AttendanceSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AttendanceSession',
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
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
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
  },
  { timestamps: true, collection: 'attendance' },
);

AttendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
AttendanceSchema.index({ schoolId: 1, date: 1 });
AttendanceSchema.index({ studentId: 1, date: 1 });
AttendanceSchema.index({ teacherId: 1, date: 1 });

export default AttendanceSchema;
