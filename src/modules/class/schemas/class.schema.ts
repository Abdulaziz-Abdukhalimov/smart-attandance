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
    },
    grade: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'classes' },
);

ClassSchema.index(
  { schoolId: 1, name: 1, grade: 1, section: 1 },
  { unique: true },
);
ClassSchema.index({ schoolId: 1, isActive: 1 });

export default ClassSchema;
