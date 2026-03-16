import { Schema } from 'mongoose';

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
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    parentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Parent',
      },
    ],
    connectCode: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'students' },
);

StudentSchema.index({ schoolId: 1, classId: 1 });
StudentSchema.index({ schoolId: 1, isActive: 1 });
StudentSchema.index({ connectCode: 1 }, { unique: true });

export default StudentSchema;
