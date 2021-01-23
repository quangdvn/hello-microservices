import {
  BadRequestError,
  NotAuthorizedError,
  requireAuth,
  RouteNotFoundError,
} from '@quangdvnnnn/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publisher/ticketUpdatedPublisher';
import { Ticket, TicketDocument } from '../models/ticket';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.put(
  '/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = (await Ticket.findById(req.params.id)) as TicketDocument;

    if (!ticket) {
      throw new RouteNotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError('Cannnot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title, price });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      version: ticket.version,
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
