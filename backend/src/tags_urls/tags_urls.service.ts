import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TagsService } from '../tags/tags.service.js';
import { toResponse as toUrlResponse, UrlsService, type UrlWithTagsResponse } from '../urls/urls.service.js';
import { TagUrlDto } from './dto/tag_url.dto.js';

export type TagUrlResponse = {
  id: number;
  url_id: number;
  tag_id: number;
  created_at: Date;
};

@Injectable()
export class TagsUrlsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
    private readonly urlsService: UrlsService,
  ) {}

  async create(dto: TagUrlDto): Promise<TagUrlResponse> {
    const resUrl = await this.urlsService.findOne(dto.url_id);
    if (!resUrl) {
      throw new NotFoundException(`Url ${dto.url_id} not found`);
    }

    const resTag = await this.tagsService.findOne(dto.tag_id);
    if (!resTag) {
      throw new NotFoundException(`Tag ${dto.tag_id} not found`);
    }

    const resExisting = await this.prisma.tags_urls.findUnique({
      where: { url_id_tag_id: { url_id: dto.url_id, tag_id: dto.tag_id } },
    });
    if (resExisting) {
      throw new ConflictException(`Url ${dto.url_id} already has tag ${dto.tag_id}`);
    }

    const resTagUrl = await this.prisma.tags_urls.create({
      data: { url_id: dto.url_id, tag_id: dto.tag_id },
    });
    return resTagUrl;
  }

  async remove(dto: TagUrlDto): Promise<void> {
    const resExisting = await this.prisma.tags_urls.findUnique({
      where: { url_id_tag_id: { url_id: dto.url_id, tag_id: dto.tag_id } },
    });
    if (!resExisting) {
      throw new NotFoundException(`Url ${dto.url_id} does not have tag ${dto.tag_id}`);
    }

    await this.prisma.tags_urls.delete({
      where: { url_id_tag_id: { url_id: dto.url_id, tag_id: dto.tag_id } },
    });
  }

  async findUrlsByTag(tag_id: number): Promise<UrlWithTagsResponse[]> {
    const resTag = await this.tagsService.findOne(tag_id);
    if (!resTag) {
      throw new NotFoundException(`Tag ${tag_id} not found`);
    }

    const resTagUrls = await this.prisma.tags_urls.findMany({
      where: { tag_id },
      include: { urls: true },
      orderBy: [{ created_at: 'desc' }],
    });

    const result: UrlWithTagsResponse[] = [];
    for (const resTagUrl of resTagUrls) {
      const urlResponse = toUrlResponse(resTagUrl.urls);
      const all_tags = await this.urlsService.findTagsByUrl(resTagUrl.urls.id);
      result.push({
        id: urlResponse.id,
        raw_url: urlResponse.raw_url,
        short_code: urlResponse.short_code,
        title: urlResponse.title,
        notes: urlResponse.notes,
        created_at: urlResponse.created_at,
        updated_at: urlResponse.updated_at,
        all_tags,
      });
    }
    return result;
  }
}
