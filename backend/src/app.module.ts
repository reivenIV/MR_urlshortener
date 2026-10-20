import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClicksModule } from './clicks/clicks.module.js';
import { FoldersModule } from './folders/folders.module.js';
import { TagsModule } from './tags/tags.module.js';
import { UrlsModule } from './urls/urls.module.js';

@Module({
  imports: [UrlsModule, TagsModule, FoldersModule, ClicksModule],
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
