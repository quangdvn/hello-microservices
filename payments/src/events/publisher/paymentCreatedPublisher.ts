import { PaymentCreatedEvent, Publisher, Subjects } from '@quangdvnnnn/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  //@ts-ignore
  subject: Subjects.PaymentCreated = 'payment:created';
}
