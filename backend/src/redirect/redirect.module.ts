import { Module } from '@nestjs/common';
import { ClicksModule } from '../clicks/clicks.module.js';
import { UrlsModule } from '../urls/urls.module.js';
import { RedirectController } from './redirect.controller.js';
import { RedirectService } from './redirect.service.js';

@Module({
  imports: [UrlsModule, ClicksModule],
  controllers: [RedirectController],
  providers: [RedirectService],
})
export class RedirectModule {}
