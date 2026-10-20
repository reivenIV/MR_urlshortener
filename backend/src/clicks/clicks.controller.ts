import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ClicksService } from './clicks.service.js';

@Controller('urls/amount_clicks/:url_id')
export class ClicksController {
  constructor(private readonly clicksService: ClicksService) {}

  @Get()
  countByUrl(@Param('url_id', ParseIntPipe) url_id: number) {
    return this.clicksService.countByUrl(url_id);
  }
}
