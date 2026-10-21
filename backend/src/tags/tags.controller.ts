import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTagDto } from './dto/create_tag.dto.js';
import { UpdateTagDto } from './dto/update_tag.dto.js';
import { TagsService } from './tags.service.js';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() dto: CreateTagDto) {
    return await this.tagsService.create(dto);
  }

  @Get('all')
  async findAll() {
    return await this.tagsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) {
    return await this.tagsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.tagsService.remove(id);
  }
}
