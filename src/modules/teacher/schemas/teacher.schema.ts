import { Schema } from 'mongoose';
import { TeacherRole } from '../enums/teacher-role.enum';

const TeacherSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(TeacherRole),
      default: TeacherRole.TEACHER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'teachers' },
);

TeacherSchema.index({ schoolId: 1, email: 1 }, { unique: true });
TeacherSchema.index({ schoolId: 1, isActive: 1 });

export default TeacherSchema;
