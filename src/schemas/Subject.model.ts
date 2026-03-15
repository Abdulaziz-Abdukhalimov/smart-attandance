import { Schema } from 'mongoose';

const SubjectSchema = new Schema(
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'subjects' },
);

SubjectSchema.index({ schoolId: 1 });
SubjectSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export default SubjectSchema;
