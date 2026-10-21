import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, type TestApp } from './utils/create_test_app.js';

describe('Urls (e2e)', () => {
  let app: INestApplication;
  let prisma: TestApp['prisma'];
  let createdId: number;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    prisma = testApp.prisma;
  });

  afterAll(async () => {
    // safety net: if a test failed before its own cleanup ran, remove the row anyway
    if (createdId) {
      await prisma.urls.deleteMany({ where: { id: createdId } });
    }
    await app.close();
  });

  it('creates a url with only raw_url (nulls for the rest)', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/urls')
      .send({ raw_url: 'https://example.com' })
      .expect(201);

    expect(res.body.id).toBeTypeOf('number');
    expect(res.body.raw_url).toBe('https://example.com');
    expect(res.body.short_code).toHaveLength(7);
    expect(res.body.title).toBeNull();
    expect(res.body.notes).toBeNull();
    expect(res.body.created_at).toBeTypeOf('string');
    expect(res.body.updated_at).toBeTypeOf('string');

    createdId = res.body.id;
  });

  it('creates a url with title and notes', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/urls')
      .send({ raw_url: 'https://google.com', title: 'Example', notes: 'just a test' })
      .expect(201);

    expect(res.body.title).toBe('Example');
    expect(res.body.notes).toBe('just a test');

    // this test's own fixture, not the shared createdId: clean it up right here
    await request(app.getHttpServer()).delete(`/v1/urls/${res.body.id}`).expect(200);
  });

  it('lists all urls and includes the one just created', async () => {
    const res = await request(app.getHttpServer()).get('/v1/urls/all').expect(200);

    const found = res.body.find((url: { id: number }) => url.id === createdId);
    expect(found).toBeDefined();
    expect(found.all_tags).toEqual([]);
  });

  it('updates a url', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/v1/urls/${createdId}`)
      .send({ title: 'new title' })
      .expect(200);

    expect(res.body.title).toBe('new title');
  });

  it('rejects an empty patch body with 400', async () => {
    const res = await request(app.getHttpServer()).patch(`/v1/urls/${createdId}`).send({}).expect(400);

    expect(Array.isArray(res.body.message)).toBe(true);
  });

  it('deletes a url, then 404s on deleting it again', async () => {
    await request(app.getHttpServer()).delete(`/v1/urls/${createdId}`).expect(200);
    await request(app.getHttpServer()).delete(`/v1/urls/${createdId}`).expect(404);

    // already deleted: afterAll's safety net has nothing left to clean up
    createdId = 0;
  });
});
