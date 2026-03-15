import { Schema } from 'mongoose';

const ClassSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'classes' },
);

ClassSchema.index({ schoolId: 1 });
ClassSchema.index({ schoolId: 1, grade: 1, section: 1 }, { unique: true });

export default ClassSchema;
