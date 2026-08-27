import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  createdAt: Date;
  lastSeenAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export const User = model<IUser>('User', userSchema);
