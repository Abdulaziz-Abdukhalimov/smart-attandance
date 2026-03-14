import { Schema } from 'mongoose';

const TeacherSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    teacherFullName: {
      type: String,
      required: true,
    },
    teacherEmail: {
      type: String,
      required: true,
    },
    teacherPhone: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'schools' },
);
TeacherSchema.index({ schoolName: 1, isActive: 1 });

export default TeacherSchema;
