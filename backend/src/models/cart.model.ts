import { Schema, Types, model, type InferSchemaType } from 'mongoose';

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      min: 1,
      required: true
    }
  },
  {
    _id: false
  }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    items: {
      type: [cartItemSchema],
      default: [],
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type CartDocument = InferSchemaType<typeof cartSchema> & {
  id: string;
  userId: Types.ObjectId;
};

export const CartModel = model('Cart', cartSchema);
