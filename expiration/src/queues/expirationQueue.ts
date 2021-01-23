import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publisher/expirationCompletePublisher';
import { natsWrapper } from '../natsWrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log('hello', job.data);
  try {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
  } catch (err) {
    console.log(err);
  }
});

export { expirationQueue };
