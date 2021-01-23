import { NotAuthorizedError, RouteNotFoundError } from '@quangdvnnnn/common';
import express, { Request, Response } from 'express';
import { Order, OrderDocument } from '../models/order';

const router = express.Router();

router.get('/:orderId', async (req: Request, res: Response) => {
  const order = (await Order.findById(req.params.orderId).populate(
    'ticket'
  )) as OrderDocument;

  if (!order) {
    throw new RouteNotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  res.send(order);
});

export { router as showOrderRouter };
