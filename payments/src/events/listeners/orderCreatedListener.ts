import { Listener, OrderCreatedEvent, Subjects } from '@quangdvnnnn/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, ticket, status, userId, version } = data;
    const order = Order.build({
      id,
      price: ticket.price,
      status,
      userId,
      version,
    });
    await order.save();
    msg.ack();
  }
}
