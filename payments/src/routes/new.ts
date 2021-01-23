import {
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
  requireAuth,
  RouteNotFoundError,
} from '@quangdvnnnn/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publisher/paymentCreatedPublisher';
import { Order, OrderDocument } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../natsWrapper';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  async (req: Request, res: Response) => {
    console.log(req.body);
    const { token, orderId } = req.body;
    const order = (await Order.findById(orderId)) as OrderDocument;
    if (!order) {
      throw new RouteNotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.send({ success: true, paymentId: payment.id });
  }
);

export { router as CreateChargeRouter };
