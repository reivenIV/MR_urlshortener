import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, type TestApp } from './utils/create_test_app.js';

describe('Redirect (e2e)', () => {
  let app: INestApplication;
  let prisma: TestApp['prisma'];
  let createdId: number;
  let shortCode: string;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    prisma = testApp.prisma;

    const res = await request(app.getHttpServer())
      .post('/v1/urls')
      .send({ raw_url: 'https://example.com' })
      .expect(201);

    createdId = res.body.id;
    shortCode = res.body.short_code;
  });

  afterAll(async () => {
    if (createdId) {
      await prisma.urls.deleteMany({ where: { id: createdId } });
    }
    await app.close();
  });

  it('starts at 0 clicks', async () => {
    const res = await request(app.getHttpServer()).get(`/v1/urls/amount_clicks/${createdId}`).expect(200);

    expect(res.body.amount_clicks).toBe(0);
  });

  it('redirects with a 302 and the right Location, no /v1 prefix', async () => {
    // .redirects(0): don't follow it, we want to see the raw 302 ourselves
    const res = await request(app.getHttpServer()).get(`/${shortCode}`).redirects(0).expect(302);

    expect(res.headers.location).toBe('https://example.com');
  });

  it('recorded the click', async () => {
    const res = await request(app.getHttpServer()).get(`/v1/urls/amount_clicks/${createdId}`).expect(200);

    expect(res.body.amount_clicks).toBe(1);
  });

  it('a made-up short_code 404s', async () => {
    await request(app.getHttpServer()).get('/doesnotexist123').redirects(0).expect(404);
  });

  it('a made-up url_id 404s', async () => {
    await request(app.getHttpServer()).get('/v1/urls/amount_clicks/999999').expect(404);
  });
});
