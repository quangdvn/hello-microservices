import { Listener, OrderCreatedEvent, Subjects } from '@quangdvnnnn/common';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketDocument } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publisher/ticketUpdatedPublisher';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = (await Ticket.findById(data.ticket.id)) as TicketDocument;
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: data.id });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
