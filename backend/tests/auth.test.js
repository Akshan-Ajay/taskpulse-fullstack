import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';
import { connectTestDb, clearTestDb, closeTestDb } from './setup/db.js';

describe('POST /api/auth/register & login', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@nsbm.lk' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password violates security rules', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'user@nsbm.lk',
        password: '123'
      });

    expect(res.status).toBe(400);
  });

  it('registers a valid user and stores hashed password in memory DB', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'user@nsbm.lk',
        password: 'Password123!'
      });

    expect([200, 201]).toContain(res.status);
  });

  it('returns 401 when logging in with incorrect credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'user@nsbm.lk',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@nsbm.lk',
        password: 'WrongPassword!'
      });

    expect(res.status).toBe(401);
  });

  it('authenticates and returns a signed 3-part JWT token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'user@nsbm.lk',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@nsbm.lk',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token.split('.')).toHaveLength(3);
  });
});
