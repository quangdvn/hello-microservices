import request from 'supertest';
import { app } from '../../app';

describe('New Route', () => {
  it('has a route handler listening to / for post requests', async () => {
    const res = await request(app).post('/').send({});

    expect(res.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/').send({}).expect(401);
  });

  it('return a status other than 401 if the user is signed in', async () => {});

  it('returns an error if an invalid title is provided', async () => {});

  it('returns an error if an invalid price is provided', async () => {});

  it('creates a tickets with valid input', async () => {});
});
