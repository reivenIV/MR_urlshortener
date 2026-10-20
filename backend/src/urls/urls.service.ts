import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { hasAtLeastOneField } from '../common/common_validators.js';
import { type urls } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUrlDto } from './dto/create_url.dto.js';
import { UpdateUrlDto } from './dto/update_url.dto.js';

// what the API sends back for one url (same field names as the DB)
export type UrlResponse = {
  id: number;
  raw_url: string;
  short_code: string;
  title: string | null;
  notes: string | null;
  created_at: Date;
};

// id is already a plain number (Int column), no conversion needed
function toResponse(resUrl: urls): UrlResponse {
  return {
    id: resUrl.id,
    raw_url: resUrl.raw_url,
    short_code: resUrl.short_code,
    title: resUrl.title,
    notes: resUrl.notes,
    created_at: resUrl.created_at,
  };
}

/*
6 characters │ 62⁶ = 56,800,235,584 (~56.8 billion)        │
7 characters │ 62⁷ = 3,521,614,606,208 (~3.5 trillion)     │
8 characters │ 62⁸ = 218,340,105,584,896 (~218.3 trillion) │
*/
// 7 random chars, a-z A-Z 0-9
function makeShortCode(): string {
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  // null if no url has this code
  async findByShortCode(short_code: string): Promise<urls | null> {
    const resUrl = await this.prisma.urls.findUnique({ where: { short_code } });
    return resUrl;
  }

  async create(dto: CreateUrlDto): Promise<UrlResponse> {
    let shortCode = makeShortCode();
    let isCodeInDb = true;
    let remainingAttempts = 5;

    while (isCodeInDb && remainingAttempts > 0) {
      const resExisting = await this.findByShortCode(shortCode);
      if (resExisting) {
        shortCode = makeShortCode();
      } else {
        isCodeInDb = false;
      }
      remainingAttempts--;
    }

    if (isCodeInDb) {
      throw new Error('could not find a free short code after 5 tries');
    }

    const resUrl = await this.prisma.urls.create({
      data: {
        raw_url: dto.raw_url,
        short_code: shortCode,
        title: dto.title,
        notes: dto.notes,
      },
    });
    return toResponse(resUrl);
  }

  async findAll(): Promise<UrlResponse[]> {
    const resUrls = await this.prisma.urls.findMany({
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
    });

    const result: UrlResponse[] = [];
    for (const resUrl of resUrls) {
      result.push(toResponse(resUrl));
    }
    return result;
  }

  // null if no url has this id
  async findOne(id: number): Promise<urls | null> {
    const resUrl = await this.prisma.urls.findUnique({ where: { id } });
    return resUrl;
  }

  async update(id: number, dto: UpdateUrlDto): Promise<UrlResponse> {
    if (!hasAtLeastOneField(dto)) {
      throw new BadRequestException(['Send at least one field to change: raw_url, title or notes']);
    }

    const resExisting = await this.findOne(id);
    if (!resExisting) {
      throw new NotFoundException(`Url ${id} not found`);
    }

    const resUrl = await this.prisma.urls.update({ where: { id }, data: dto });
    return toResponse(resUrl);
  }

  async remove(id: number): Promise<void> {
    const resExisting = await this.findOne(id);
    if (!resExisting) {
      throw new NotFoundException(`Url ${id} not found`);
    }

    await this.prisma.urls.delete({ where: { id } });
  }
}
