const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/database.json');

beforeEach(() => {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], giftcards: [] }, null, 2));
});

describe('Gift Card Endpoints', () => {
  it('debe devolver solo las gift cards del usuario autenticado', async () => {
    // Primero registramos un usuario y luego hacemos login para obtener el token
    await request(app)
      .post('/auth/register')
      .send({
        email: 'giftuser@example.com',
        password: '123456'
      });

// Hacemos login para obtener el token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'giftuser@example.com',
        password: '123456'
      });

    const token = loginRes.body.token;

// Creamos una gift card para el usuario autenticado
    await request(app)
      .post('/giftcards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 100,
        currency: 'USD',
        expirationDate: '2026-12-31'
      });

    const res = await request(app)
      .get('/giftcards')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('amount', 100);
    expect(res.body[0]).toHaveProperty('currency', 'USD');
  });
});
