import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, type TestApp } from './utils/create_test_app.js';

describe('Tags (e2e)', () => {
  let app: INestApplication;
  let prisma: TestApp['prisma'];
  let createdId: number;
  // a name unlikely to collide with real tags already in the dev DB
  let testName: string;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    prisma = testApp.prisma;
    // short: tag names are capped at 15 chars now, "_b" variant included
    testName = `e2e${Date.now() % 100000}`;
  });

  afterAll(async () => {
    if (createdId) {
      await prisma.tags.deleteMany({ where: { id: createdId } });
    }
    await app.close();
  });

  it('creates a tag and lowercases the name', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/tags')
      .send({ name: testName.toUpperCase() })
      .expect(201);

    expect(res.body.id).toBeTypeOf('number');
    expect(res.body.name).toBe(testName);
    expect(res.body.color).toBe('#808080');

    createdId = res.body.id;
  });

  it('creates a tag with a color', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/tags')
      .send({ name: `${testName}_b`, color: '#00ff00' })
      .expect(201);

    expect(res.body.color).toBe('#00ff00');

    await request(app.getHttpServer()).delete(`/v1/tags/${res.body.id}`).expect(200);
  });

  it('rejects a duplicate name, even with different case, with 409', async () => {
    await request(app.getHttpServer()).post('/v1/tags').send({ name: testName }).expect(409);
  });

  it('lists all tags and includes the one just created', async () => {
    const res = await request(app.getHttpServer()).get('/v1/tags/all').expect(200);

    const found = res.body.find((tag: { id: number }) => tag.id === createdId);
    expect(found).toBeDefined();
    expect(found.name).toBe(testName);
  });

  it('updates a tag color', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/v1/tags/${createdId}`)
      .send({ color: '#ff0000' })
      .expect(200);

    expect(res.body.color).toBe('#ff0000');
  });

  it('rejects an empty patch body with 400', async () => {
    const res = await request(app.getHttpServer()).patch(`/v1/tags/${createdId}`).send({}).expect(400);

    expect(Array.isArray(res.body.message)).toBe(true);
  });

  it('deletes a tag, then 404s on deleting it again', async () => {
    await request(app.getHttpServer()).delete(`/v1/tags/${createdId}`).expect(200);
    await request(app.getHttpServer()).delete(`/v1/tags/${createdId}`).expect(404);

    createdId = 0;
  });
});
