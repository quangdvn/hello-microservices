import mongoose from 'mongoose';
import { app } from './app';

const bootstrap = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWt Key missing');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo Uri missing');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to Auth MongoDB ...');
  } catch (err) {
    console.log(err);
  }
  app.listen(4000, () => {
    console.log('Listening on port 4000 ...');
  });
};

bootstrap();
