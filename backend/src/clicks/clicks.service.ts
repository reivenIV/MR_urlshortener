import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UrlsService } from '../urls/urls.service.js';

export type ClicksCountResponse = {
  amount_clicks: number;
};

@Injectable()
export class ClicksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly urlsService: UrlsService,
  ) {}

  async countByUrl(url_id: number): Promise<ClicksCountResponse> {
    const resUrl = await this.urlsService.findOne(url_id);
    if (!resUrl) {
      throw new NotFoundException(`Url_id :  ${url_id} not found`);
    }

    const amount_clicks = await this.prisma.url_clicks.count({ where: { url_id } });
    return { amount_clicks };
  }

  // called by the redirect, one row per visit
  async record(url_id: number): Promise<void> {
    await this.prisma.url_clicks.create({ data: { url_id } });
  }
}
