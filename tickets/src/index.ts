import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/orderCancelledListener';
import { OrderCreatedListener } from './events/listeners/orderCreatedListener';
import { natsWrapper } from './natsWrapper';

const bootstrap = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWt Key missing');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo Uri missing');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID missing');
  }

  console.log(process.env.NATS_CLIENT_ID);

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
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to Tickets MongoDB ...');
  } catch (err) {
    console.log(err);
  }
  app.listen(4000, () => {
    console.log('Listening on port 4000 ...');
  });
};

bootstrap();
