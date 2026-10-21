import { Injectable, NotFoundException } from '@nestjs/common';
import { ClicksService } from '../clicks/clicks.service.js';
import { UrlsService } from '../urls/urls.service.js';

@Injectable()
export class RedirectService {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly clicksService: ClicksService,
  ) {}

  // take the short code and figure out what real thing it points to
  async resolve(short_code: string): Promise<string> {
    const resUrl = await this.urlsService.findByShortCode(short_code);
    if (!resUrl) {
      throw new NotFoundException(`short_code : ${short_code} not found`);
    }

    await this.clicksService.record(resUrl.id);
    return resUrl.raw_url;
  }
}
