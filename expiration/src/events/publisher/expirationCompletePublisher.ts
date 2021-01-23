import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@quangdvnnnn/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
