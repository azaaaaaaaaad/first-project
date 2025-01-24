import { StationaryModel } from './stationary.model';
import { TStationary } from './stationary.interface';

const createStationaryIntoDB = async (stationary: TStationary) => {
  const result = await StationaryModel.create(stationary);
  return result;
};

const getAllStationaryFromDB = async () => {
  const result = await StationaryModel.find();
  return result;
};

const getSingleStationaryFromDB = async (id: string) => {
  const result = await StationaryModel.findById(id);
  return result;
};

const updateSingleStationaryFromDB = async (
  id: string,
  updateData: Partial<TStationary>,
) => {
  const result = await StationaryModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return result;
};

const deleteSingleStationaryFromDB = async (id: string) => {
  const result = await StationaryModel.findByIdAndDelete(id);
  return result;
};

export const StationaryServices = {
  createStationaryIntoDB,
  getAllStationaryFromDB,
  getSingleStationaryFromDB,
  updateSingleStationaryFromDB,
  deleteSingleStationaryFromDB,
};
