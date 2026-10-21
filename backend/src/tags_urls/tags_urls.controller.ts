import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TagUrlDto } from './dto/tag_url.dto.js';
import { TagsUrlsService } from './tags_urls.service.js';

@Controller()
export class TagsUrlsController {
  constructor(private readonly tagsUrlsService: TagsUrlsService) {}

  @Post('tags_urls')
  async create(@Body() dto: TagUrlDto) {
    return await this.tagsUrlsService.create(dto);
  }

  @Delete('tags_urls')
  async remove(@Body() dto: TagUrlDto) {
    return await this.tagsUrlsService.remove(dto);
  }

  @Get('urls_by_tag/:tag_id')
  async findUrlsByTag(@Param('tag_id', ParseIntPipe) tag_id: number) {
    return await this.tagsUrlsService.findUrlsByTag(tag_id);
  }
}
