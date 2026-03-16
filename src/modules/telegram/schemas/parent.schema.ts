import { Schema } from 'mongoose';

const ParentSchema = new Schema(
  {
    telegramChatId: {
      type: String,
      required: true,
      unique: true,
    },
    telegramUsername: {
      type: String,
    },
    firstName: {
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

ParentSchema.index({ telegramChatId: 1 }, { unique: true });
ParentSchema.index({ studentIds: 1 });

export default ParentSchema;
