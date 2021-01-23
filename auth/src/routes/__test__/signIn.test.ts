import request from 'supertest';
import { app } from '../../app';

describe('Sign In Route', () => {
  it('returns 400 with unexisted email', async () => {
    await request(app)
      .post('/signin')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(400);
  });

  it('returns 400 with incorrect password', async () => {
    await request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
    await request(app)
      .post('/signin')
      .send({
        email: 'test@test.com',
        password: '12',
      })
      .expect(400);
  });

  it('returns a cookie after successful signin', async () => {
    await request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
