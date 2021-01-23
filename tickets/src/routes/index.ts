import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/all', async (req: Request, res: Response) => {
  const ticket = await Ticket.find({
    orderId: undefined,
  });
  res.status(200).send(ticket);
});

export { router as indexTicketRouter };
