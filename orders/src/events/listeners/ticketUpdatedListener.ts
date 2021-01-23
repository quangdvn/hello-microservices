import { Listener, Subjects, TicketUpdatedEvent } from '@quangdvnnnn/common';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketDocument } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = (await Ticket.findByEvent(data)) as TicketDocument;

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
