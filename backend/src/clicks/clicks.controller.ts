import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ClicksService } from './clicks.service.js';

@Controller('urls/amount_clicks/:url_id')
export class ClicksController {
  constructor(private readonly clicksService: ClicksService) {}

  @Get()
  async countByUrl(@Param('url_id', ParseIntPipe) url_id: number) {
    return await this.clicksService.countByUrl(url_id);
  }
}
