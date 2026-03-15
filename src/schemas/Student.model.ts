import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const StudentSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    classId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Class',
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    parentPhone: {
      type: String,
      required: true,
      trim: true,
    },
    parentTelegramId: {
      type: String,
      default: null,
    },
    connectionCode: {
      type: String,
      default: () => uuidv4(),
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'students' },
);

StudentSchema.index({ schoolId: 1 });
StudentSchema.index({ schoolId: 1, classId: 1 });
StudentSchema.index({ connectionCode: 1 }, { unique: true });
StudentSchema.index({ parentTelegramId: 1 });
StudentSchema.index({ schoolId: 1, isActive: 1 });

export default StudentSchema;
