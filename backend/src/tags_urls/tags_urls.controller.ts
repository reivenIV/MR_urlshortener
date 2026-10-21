import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TagUrlDto } from './dto/tag_url.dto.js';
import { TagsUrlsService } from './tags_urls.service.js';

@Controller()
export class TagsUrlsController {
  constructor(private readonly tagsUrlsService: TagsUrlsService) {}

  @Post('tags_urls')
  create(@Body() dto: TagUrlDto) {
    return this.tagsUrlsService.create(dto);
  }

  @Delete('tags_urls')
  remove(@Body() dto: TagUrlDto) {
    return this.tagsUrlsService.remove(dto);
  }

  @Get('urls_by_tag/:tag_id')
  findUrlsByTag(@Param('tag_id', ParseIntPipe) tag_id: number) {
    return this.tagsUrlsService.findUrlsByTag(tag_id);
  }
}
