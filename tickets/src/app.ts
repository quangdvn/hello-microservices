import express, { Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import session from 'express-session';
import {
  currentUser,
  errorHandler,
  RouteNotFoundError,
} from '@quangdvnnnn/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { updateTicketRouter } from './routes/update';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import { indexTicketRouter } from './routes';

const RedisStore = connectRedis(session);
const RedisClient = new Redis('//session-redis-serv:6379');

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

app.use(currentUser);
app.use(indexTicketRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);

app.get('/', (_, res: Response) => {
  res.send({ success: true, data: 'Hello to Tickets Service' });
});

app.all('*', () => {
  throw new RouteNotFoundError();
});
//* Error middleware
app.use(errorHandler);

export { app };
