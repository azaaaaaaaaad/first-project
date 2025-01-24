import { Request, Response } from 'express';
import { StationaryServices } from './stationary.service';

const createStationary = async (req: Request, res: Response) => {
  try {
    const stationary = req.body;
    const result = await StationaryServices.createStationaryIntoDB(stationary);
    res.status(200).json({
      success: true,
      message: `Product created successfully`,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllStationary = async (req: Request, res: Response) => {
  try {
    const result = await StationaryServices.getAllStationaryFromDB();
    res.status(200).json({
      success: true,
      message: `Products retrieved successfully`,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleStationary = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result =
      await StationaryServices.getSingleStationaryFromDB(productId);
    res.status(200).json({
      success: true,
      message: `Product retrieved successfully`,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateSingleStationary = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    const result = await StationaryServices.updateSingleStationaryFromDB(
      productId,
      updateData,
    );
    res.status(200).json({
      success: true,
      message: `Product updated successfully`,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteSingleStationary = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result =
      await StationaryServices.deleteSingleStationaryFromDB(productId);
    res.status(200).json({
      success: true,
      message: `Product deleted successfully`,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StationaryControllers = {
  createStationary,
  getAllStationary,
  getSingleStationary,
  updateSingleStationary,
  deleteSingleStationary,
};
