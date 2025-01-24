import { Request, Response } from 'express';
import { OrderServices } from './order.service';

const orderCreate = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const result = await OrderServices.createOrderIntoDB(order);
    res.status(200).json({
      message: `Order created successfully`,
      status: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const calculateRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.createRevenueFromDB();
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: `Total Revenue ${result}`,
    });
  } catch (error) {
    console.log(error);
  }
};

export const OrderControllers = {
  orderCreate,
  calculateRevenue,
};
