import { Schema, Types, model, type InferSchemaType } from 'mongoose';
import { ORDER_STATUS_VALUES, ORDER_STATUSES } from '../types/order-status.js';

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      min: 1,
      required: true
    },
    lineTotal: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: ORDER_STATUSES.placed,
      required: true
    },
    items: {
      type: [orderItemSchema],
      default: [],
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    deliveryAddress: {
      zip: {
        type: String,
        required: true,
        default: ''
      },
      street: {
        type: String,
        required: true,
        default: ''
      },
      city: {
        type: String,
        required: true,
        default: ''
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  id: string;
  userId: Types.ObjectId;
};

export const OrderModel = model('Order', orderSchema);
