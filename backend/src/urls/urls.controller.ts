import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUrlDto } from './dto/create_url.dto.js';
import { UpdateUrlDto } from './dto/update_url.dto.js';
import { UrlsService } from './urls.service.js';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() dto: CreateUrlDto) {
    return await this.urlsService.create(dto);
  }

  @Get('all')
  async findAll() {
    return await this.urlsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUrlDto) {
    return await this.urlsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.urlsService.remove(id);
  }
}
