import { Schema } from 'mongoose';

const SchoolSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
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

SchoolSchema.index({ name: 1, isActive: 1 });

export default SchoolSchema;
