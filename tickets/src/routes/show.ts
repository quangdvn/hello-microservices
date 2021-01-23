import { RouteNotFoundError } from '@quangdvnnnn/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  console.log(req.path);
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new RouteNotFoundError();
  }
  res.status(200).send(ticket);
});

export { router as showTicketRouter };
