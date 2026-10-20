import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto.js';
import { UrlsService } from './urls.service.js';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() dto: CreateUrlDto) {
    return this.urlsService.create(dto);
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }
}
