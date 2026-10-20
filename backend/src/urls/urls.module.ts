import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UrlsController } from './urls.controller.js';
import { UrlsService } from './urls.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService],
})
export class UrlsModule {}
