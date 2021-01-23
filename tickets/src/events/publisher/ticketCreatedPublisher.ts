import { Publisher, Subjects, TicketCreatedEvent } from '@quangdvnnnn/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
