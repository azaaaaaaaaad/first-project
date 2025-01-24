import express from 'express';
import { StationaryControllers } from './stationary.controller';

const router = express.Router();

router.post('/', StationaryControllers.createStationary);
router.get('/', StationaryControllers.getAllStationary);
router.get('/:productId', StationaryControllers.getSingleStationary);
router.put('/:productId', StationaryControllers.updateSingleStationary)
router.delete('/:productId', StationaryControllers.deleteSingleStationary);

export const StationaryRoutes = router;
