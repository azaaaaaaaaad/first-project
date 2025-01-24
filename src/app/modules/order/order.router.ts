import express from 'express'
import { OrderControllers } from './order.controller'

const router = express.Router()

router.post('/', OrderControllers.orderCreate)
router.get('/revenue', OrderControllers.calculateRevenue)


export const OrderRoutes = router