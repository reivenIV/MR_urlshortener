import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UrlsModule } from '../urls/urls.module.js';
import { ClicksController } from './clicks.controller.js';
import { ClicksService } from './clicks.service.js';

@Module({
  imports: [PrismaModule, UrlsModule],
  controllers: [ClicksController],
  providers: [ClicksService],
})
export class ClicksModule {}
