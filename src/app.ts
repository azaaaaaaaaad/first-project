import express, { Application, Request, Response } from 'express';
import cors from 'cors';
// import { StudentRoutes } from './app/modules/student/student.route'
import { StationaryRoutes } from './app/modules/stationary/stationary.router';
import { OrderRoutes } from './app/modules/order/order.router';

const app: Application = express();

app.use(express.json());
app.use(cors());

// app.use('/api/v1/students', StudentRoutes)
app.use('/api/products', StationaryRoutes);
app.use('/api/orders', OrderRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
