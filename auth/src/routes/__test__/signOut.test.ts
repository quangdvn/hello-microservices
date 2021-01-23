import request from 'supertest';
import { app } from '../../app';

describe('Sign Out Route', () => {
  it('clears the cookie after successful signout', async () => {
    await request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
    const response = await request(app).post('/signout').send({}).expect(200);
    expect(response.get('Set-Cookie')[0]).toEqual(
      'qid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
  });
});
