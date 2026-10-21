import { Controller, Get, Param, Redirect, VERSION_NEUTRAL } from '@nestjs/common';
import { RedirectService } from './redirect.service.js';

// no /v1 here on purpose, short codes have to stay short
@Controller({ path: '', version: VERSION_NEUTRAL })
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':short_code')
  @Redirect()
  async handleRedirect(@Param('short_code') short_code: string) {
    const raw_url = await this.redirectService.resolve(short_code);
    return { url: raw_url, statusCode: 302 };
  }
}
