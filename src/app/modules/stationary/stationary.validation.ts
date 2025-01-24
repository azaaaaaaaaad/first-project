import { z } from 'zod';

export const stationaryValidationSchema = z.object({
  name: z.string().nonempty('Name is required'),
  brand: z.string().nonempty('Brand is required'),
  price: z.number().min(0, 'Price must be a non-negative number'),
  category: z.enum([
    'Writing',
    'Office Supplies',
    'Art Supplies',
    'Educational',
    'Technology',
  ]),
  description: z.string().nonempty('Description is required'),
  quantity: z.number().int().min(0, 'Quantity must be a non-negative integer'),
  inStock: z.boolean(),
});

export default stationaryValidationSchema;
