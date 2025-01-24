import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
  {
    email: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product', 
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, 
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0, 
    },
  },
  {
    timestamps: true, 
  },
);

export const OrderModel = model<TOrder>('Order', orderSchema);
