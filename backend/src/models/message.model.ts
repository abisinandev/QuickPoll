import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  userId: Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Message = model<IMessage>('Message', messageSchema);
