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
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'subjects' },
);

SubjectSchema.index({ schoolId: 1, name: 1 }, { unique: true });
SubjectSchema.index({ schoolId: 1, isActive: 1 });

export default SubjectSchema;
