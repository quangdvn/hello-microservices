import request from 'supertest';
import { app } from '../../app';

describe('Sign Up Route', () => {
  it('returns 201 on successful sign up', async () => {
    return request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
  });

  it('returns 400 on invalid sign up by email', async () => {
    return request(app)
      .post('/signup')
      .send({
        email: 'testtest.com',
        password: '123456',
      })
      .expect(400);
  });

  it('returns 400 on invalid sign up by password', async () => {
    return request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123',
      })
      .expect(400);
  });

  it('returns 400 on invalid sign up with no data', async () => {
    return request(app).post('/signup').send({}).expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
    await request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
