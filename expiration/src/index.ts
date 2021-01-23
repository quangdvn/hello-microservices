import { OrderCreatedListener } from './events/listeners/orderCreatedListener';
import { natsWrapper } from './natsWrapper';

const bootstrap = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID missing');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID missing');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL missing');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close()); //* Make sure message not sent to dead client
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

bootstrap();
