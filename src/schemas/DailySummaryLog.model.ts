import { Schema } from 'mongoose';

const DailySummaryLogSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    date: {
      type: String,
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, collection: 'daily_summary_logs' },
);

DailySummaryLogSchema.index({ studentId: 1, date: 1 }, { unique: true });
DailySummaryLogSchema.index({ date: 1, sent: 1 });

export default DailySummaryLogSchema;
