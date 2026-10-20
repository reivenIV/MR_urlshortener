import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUrlDto } from './dto/create_url.dto.js';
import { UpdateUrlDto } from './dto/update_url.dto.js';
import { UrlsService } from './urls.service.js';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() dto: CreateUrlDto) {
    return this.urlsService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.urlsService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUrlDto) {
    return this.urlsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.urlsService.remove(id);
  }
}
