const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/database.json');

beforeEach(() => {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], giftcards: [] }, null, 2));
});

describe('Auth Endpoints', () => {
  it('debe registrar un usuario nuevo', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: '123456'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Usuario registrado correctamente');
  });

  it('debe hacer login y devolver un token', async () => {
    // primero registrar al usuario
    await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: '123456'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: '123456'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

});
