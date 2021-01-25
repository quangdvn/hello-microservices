import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(): Promise<string[]>;
    }
  }
}

let mongo: any;

beforeAll(async () => {
  jest.setTimeout(5000);

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

global.getAuthCookie = async () => {
  const email = 'test@test.com';
  const password = '123456';

  const response = await request(app)
    .post('/signup')
    .send({
      email,
      password,
    })
    .expect(201);
  const cookie = response.get('Set-Cookie');
  return cookie;
};
