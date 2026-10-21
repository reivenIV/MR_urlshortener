import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClicksModule } from './clicks/clicks.module.js';
import { TagsModule } from './tags/tags.module.js';
import { TagsUrlsModule } from './tags_urls/tags_urls.module.js';
import { UrlsModule } from './urls/urls.module.js';

@Module({
  imports: [UrlsModule, TagsModule, ClicksModule, TagsUrlsModule],
  providers: [
    // checks every request body against its DTO
    // With these block we activate the inbuilt validator of nest.js
    {
      provide: APP_PIPE,                                 // "apply this to every route, automatically."
      useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),                     // status 400 in case the incoming bodies is not validated.
    },
  ],
})
export class AppModule {}
