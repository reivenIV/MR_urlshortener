import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TagsModule } from '../tags/tags.module.js';
import { UrlsModule } from '../urls/urls.module.js';
import { TagsUrlsController } from './tags_urls.controller.js';
import { TagsUrlsService } from './tags_urls.service.js';

@Module({
  imports: [PrismaModule, TagsModule, UrlsModule],
  controllers: [TagsUrlsController],
  providers: [TagsUrlsService],
})
export class TagsUrlsModule {}
