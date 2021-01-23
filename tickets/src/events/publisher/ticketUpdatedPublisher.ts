import { Publisher, Subjects, TicketUpdatedEvent } from '@quangdvnnnn/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
