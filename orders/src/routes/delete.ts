import {
  NotAuthorizedError,
  OrderStatus,
  requireAuth,
  RouteNotFoundError,
} from '@quangdvnnnn/common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { Order, OrderDocument } from '../models/order';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.delete('/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = (await Order.findById(orderId)).populate(
    'ticket'
  ) as OrderDocument;

  if (!order) {
    throw new RouteNotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
