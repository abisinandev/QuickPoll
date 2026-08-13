import { Schema, model, Document, Types } from 'mongoose';

export interface IVote extends Document {
  userId: Types.ObjectId;
  pollId: Types.ObjectId;
  optionId: Types.ObjectId;
  createdAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    pollId: {
      type: Schema.Types.ObjectId,
      ref: 'Poll',
      required: [true, 'Poll ID is required'],
    },
    optionId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Option ID is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

//Duplicates preventing
voteSchema.index({ userId: 1, pollId: 1 }, { unique: true });

export const Vote = model<IVote>('Vote', voteSchema);
