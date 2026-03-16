import { Schema, model, type InferSchemaType } from 'mongoose';
import { PRODUCT_DESCRIPTION_MAX_LENGTH, REVIEW_COMMENT_MAX_LENGTH } from '../constants/validation.js';

const productReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      default: '',
      maxlength: REVIEW_COMMENT_MAX_LENGTH
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: PRODUCT_DESCRIPTION_MAX_LENGTH
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      default: [],
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
      required: true
    },
    reviews: {
      type: [productReviewSchema],
      default: [],
      required: true
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type ProductDocument = InferSchemaType<typeof productSchema> & { id: string };

export const ProductModel = model('Product', productSchema);
