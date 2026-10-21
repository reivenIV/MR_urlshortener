import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, type TestApp } from './utils/create_test_app.js';

describe('TagsUrls (e2e)', () => {
  let app: INestApplication;
  let prisma: TestApp['prisma'];
  let urlId: number;
  let tagId: number;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    prisma = testApp.prisma;

    const urlRes = await request(app.getHttpServer()).post('/v1/urls').send({ raw_url: 'https://example.com' });
    urlId = urlRes.body.id;

    const tagRes = await request(app.getHttpServer()).post('/v1/tags').send({ name: 'tagsurlstest' });
    tagId = tagRes.body.id;
  });

  afterAll(async () => {
    // safety net: tags_urls rows cascade-delete with their url/tag, so just clean the two fixtures
    if (urlId) {
      await prisma.urls.deleteMany({ where: { id: urlId } });
    }
    if (tagId) {
      await prisma.tags.deleteMany({ where: { id: tagId } });
    }
    await app.close();
  });

  it('tags a url', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/tags_urls')
      .send({ url_id: urlId, tag_id: tagId })
      .expect(201);

    expect(res.body.id).toBeTypeOf('number');
    expect(res.body.url_id).toBe(urlId);
    expect(res.body.tag_id).toBe(tagId);
  });

  it('rejects the same link again with 409', async () => {
    await request(app.getHttpServer()).post('/v1/tags_urls').send({ url_id: urlId, tag_id: tagId }).expect(409);
  });

  it('404s on a made-up tag_id', async () => {
    await request(app.getHttpServer()).post('/v1/tags_urls').send({ url_id: urlId, tag_id: 999999 }).expect(404);
  });

  it('404s on a made-up url_id', async () => {
    await request(app.getHttpServer()).post('/v1/tags_urls').send({ url_id: 999999, tag_id: tagId }).expect(404);
  });

  it('lists the url under its tag, with all_tags populated', async () => {
    const res = await request(app.getHttpServer()).get(`/v1/urls_by_tag/${tagId}`).expect(200);

    const found = res.body.find((url: { id: number }) => url.id === urlId);
    expect(found).toBeDefined();
    expect(found.all_tags.some((tag: { id: number }) => tag.id === tagId)).toBe(true);
    expect(found.click_count).toBe(0);
  });

  it('removes the link, then 404s on removing it again', async () => {
    await request(app.getHttpServer()).delete('/v1/tags_urls').send({ url_id: urlId, tag_id: tagId }).expect(200);
    await request(app.getHttpServer()).delete('/v1/tags_urls').send({ url_id: urlId, tag_id: tagId }).expect(404);
  });
});
