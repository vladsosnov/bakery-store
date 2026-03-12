import { Schema, model, type InferSchemaType } from 'mongoose';

import { NAME_MAX_LENGTH } from '../constants/validation.js';
import { USER_ROLES } from '../types/user-role.js';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: NAME_MAX_LENGTH
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: NAME_MAX_LENGTH
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.customer,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    address: {
      zip: {
        type: String,
        trim: true
      },
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index(
  { role: 1 },
  {
    unique: true,
    partialFilterExpression: { role: USER_ROLES.admin }
  }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { id: string };

export const UserModel = model('User', userSchema);
