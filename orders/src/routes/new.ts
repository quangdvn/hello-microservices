import {
  BadRequestError,
  OrderStatus,
  requireAuth,
  RouteNotFoundError,
  validateRequest,
} from '@quangdvnnnn/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { Order } from '../models/order';
import { Ticket, TicketDocument } from '../models/ticket';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

const EXPIRATION_SECONDS = 1 * 60; //* 15 minutes

router.post(
  '/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = (await Ticket.findById(ticketId)) as TicketDocument;
    if (!ticket) {
      throw new RouteNotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });
    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
