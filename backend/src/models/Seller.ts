import { Schema, model, type InferSchemaType } from 'mongoose';

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    profileImage: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    mobileNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    skills: {
      type: [String],
      required: true,
      default: []
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['seller'],
      default: 'seller',
      immutable: true
    }
  },
  { timestamps: true }
);

export type SellerDocument = InferSchemaType<typeof sellerSchema>;

export const Seller = model('Seller', sellerSchema);
