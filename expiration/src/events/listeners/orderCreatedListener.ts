import { Listener, OrderCreatedEvent, Subjects } from '@quangdvnnnn/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expirationQueue';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delayTime = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting for this milliseconds: ', delayTime);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delayTime,
      }
    );

    msg.ack();
  }
}
