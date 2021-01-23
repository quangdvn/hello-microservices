import { OrderCreatedEvent, Publisher, Subjects } from '@quangdvnnnn/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
