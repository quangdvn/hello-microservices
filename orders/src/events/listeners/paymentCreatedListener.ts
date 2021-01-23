import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@quangdvnnnn/common';
import { Message } from 'node-nats-streaming';
import { Order, OrderDocument } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  //@ts-ignore
  subject: Subjects.PaymentCreated = 'payment:created';
  queueGroupName: string = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = (await Order.findById(data.orderId)) as OrderDocument;
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
