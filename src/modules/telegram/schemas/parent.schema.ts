import { Schema } from 'mongoose';

const ParentSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    phone: {
      type: String,
    },
    telegramChatId: {
      type: String,
      sparse: true,
      unique: true,
    },
    telegramUsername: {
      type: String,
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'parents' },
);

ParentSchema.index({ telegramChatId: 1 }, { unique: true, sparse: true });
ParentSchema.index({ phone: 1 });
ParentSchema.index({ studentIds: 1 });

export default ParentSchema;
