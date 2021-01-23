import express, { Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/currentUser';
import { signInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signOut';
import { signUpRouter } from './routes/signUp';
import { errorHandler, RouteNotFoundError } from '@quangdvnnnn/common';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

const RedisStore = connectRedis(session);
const RedisClient =
  process.env.NODE_ENV === 'test'
    ? new Redis()
    : new Redis('//session-redis-serv:6379');

const app = express();
app.set('trust proxy', true);
app.use(
  session({
    store: new RedisStore({
      client: RedisClient,
    }),
    name: 'qid',
    secret: 'quangdvn',
    resave: false,
    saveUninitialized: false,
    cookie: {
      signed: false,
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'test', //* Over HTTPS
    },
  })
);

app.use(json());
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.get('/', (_, res: Response) => {
  res.send({ success: true, data: 'Hello to Auth Service' });
});

app.all('*', () => {
  throw new RouteNotFoundError();
});
app.use(errorHandler);

export { app };
