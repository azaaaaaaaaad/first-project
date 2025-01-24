import { StationaryModel } from '../stationary/stationary.model';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';

const createOrderIntoDB = async (orderData: TOrder) => {
  const { product, quantity } = orderData;

  const productInInventory = await StationaryModel.findById(product);

  if (productInInventory?.quantity < quantity) {
    throw new Error('Insufficient Stock Available');
  }
  const order = await OrderModel.create(orderData);

  productInInventory?.quantity -= quantity;
  productInInventory?.inStock = productInInventory.quantity > 0;

  // Save the updated product inventory
  await productInInventory.save();

  return order;
};

const createRevenueFromDB = async () => {
  const revenueAggregation = await OrderModel.aggregate([
    {
      $group: {
        _id: null, // Group all documents together
        totalRevenue: { $sum: { $multiply: ['$quantity', '$totalPrice'] } }, // Calculate total revenue
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the result
        totalRevenue: 1, // Include only the totalRevenue field
      },
    },
  ]);
  return revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;
};

export const OrderServices = {
  createOrderIntoDB,
  createRevenueFromDB,
};
