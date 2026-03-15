import { Schema } from 'mongoose';
import { AttendanceStatus } from 'src/libs/enums/schedule.enum';

const AttendanceSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AttendanceSession',
    },
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: 'attendances' },
);

AttendanceSchema.index({ sessionId: 1 });
AttendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
AttendanceSchema.index({ studentId: 1 });

export default AttendanceSchema;
