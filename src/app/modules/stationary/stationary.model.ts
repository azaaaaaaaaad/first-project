import { model, Schema } from 'mongoose';
import { TStationary } from './stationary.interface';

const stationarySchema = new Schema<TStationary>({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: [
      'Writing',
      'Office Supplies',
      'Art Supplies',
      'Educational',
      'Technology',
    ],
    required: true,
  },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
},
{
  timestamps: true
});

export const StationaryModel = model<TStationary>('Product', stationarySchema);
