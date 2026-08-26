import { Schema, model, Document, Types } from 'mongoose';

export interface IPollOption {
  _id: Types.ObjectId;
  text: string;
}

export interface IPoll extends Document {
  question: string;
  options: IPollOption[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pollOptionSchema = new Schema<IPollOption>({
  text: {
    type: String,
    required: [true, 'Option text is required'],
    trim: true,
  },
});

const pollSchema = new Schema<IPoll>(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    options: {
      type: [pollOptionSchema],
      required: [true, 'Poll options are required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Poll = model<IPoll>('Poll', pollSchema);
