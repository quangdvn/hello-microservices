import request from 'supertest';
import { app } from '../../app';

describe('Current User Route', () => {
  it('returns details about the current user', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app)
      .get('/me')
      .set('Cookie', cookie)
      .send()
      .expect(200);
    expect(response.body.data.email).toEqual('test@test.com');
  });

  it('returns null if not authenticated', async () => {
    const response = await request(app).get('/me').send().expect(200);
    expect(response.body.data).toEqual(null);
  });
});
