import { Listener, OrderCancelledEvent, Subjects } from '@quangdvnnnn/common';
import { Message } from 'node-nats-streaming';
import { Order, OrderDocument, OrderStatus } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = (await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })) as OrderDocument;

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
