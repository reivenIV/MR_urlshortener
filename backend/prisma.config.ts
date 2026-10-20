import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // generate doesn't need a real connection, that's why process.env not env()
  datasource: { url: process.env.DATABASE_URL },
});
