import { OrderCancelledEvent, Publisher, Subjects } from '@quangdvnnnn/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
