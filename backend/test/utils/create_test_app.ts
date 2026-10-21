import { INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module.js';
import { PrismaService } from '../../src/prisma/prisma.service.js';

export type TestApp = {
  app: INestApplication;
  prisma: PrismaService;
};

// builds a test app, since main.ts doesn't run in test environement
// note :: The test will use the same database as the proyect.
export async function createTestApp(): Promise<TestApp> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  await app.init();

  const prisma = app.get(PrismaService);

  return { app, prisma };
}


