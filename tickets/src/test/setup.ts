import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(): string;
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'quangdvn';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthCookie = () => {
  const payload = {
    id: 'quangdvn',
    email: 'test@test.com',
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  return token;
  // const sessionJSON = JSON.stringify(sesssion);
  // const base64 = Buffer.from(sessionJSON).toString('base64');

  // return [`qid=${base64}`];
};
