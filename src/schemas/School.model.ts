import { Schema } from 'mongoose';

const SchoolSchema = new Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    schoolAddress: {
      type: String,
      required: true,
    },
    schoolPhone: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'schools' },
);
SchoolSchema.index({ schoolName: 1, isActive: 1 });

export default SchoolSchema;
