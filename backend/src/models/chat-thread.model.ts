import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const chatMessageSchema = new Schema(
  {
    senderRole: {
      type: String,
      enum: ['customer', 'moderator', 'system'],
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date()
    }
  },
  {
    _id: true
  }
);

const chatThreadSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true
    },
    messages: {
      type: [chatMessageSchema],
      default: [],
      required: true
    },
    lastMessageAt: {
      type: Date,
      required: true,
      default: () => new Date()
    },
    unreadForSupport: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type ChatThreadDocument = InferSchemaType<typeof chatThreadSchema> & {
  id: string;
  customerId: Types.ObjectId;
};

export const ChatThreadModel = model('ChatThread', chatThreadSchema);
