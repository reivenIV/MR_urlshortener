import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hasAtLeastOneField } from '../common/common_validators.js';
import { type tags } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTagDto } from './dto/create_tag.dto.js';
import { UpdateTagDto } from './dto/update_tag.dto.js';

export type TagResponse = {
  id: number;
  name: string;
  color: string;
};

function toResponse(resTag: tags): TagResponse {
  return {
    id: resTag.id,
    name: resTag.name,
    color: resTag.color,
  };
}

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  // null if no tag has this name (name is always stored lowercase)
  async findByName(name: string): Promise<tags | null> {
    const resTag = await this.prisma.tags.findUnique({ where: { name } });
    return resTag;
  }

  // null if no tag has this id
  async findOne(id: number): Promise<tags | null> {
    const resTag = await this.prisma.tags.findUnique({ where: { id } });
    return resTag;
  }

  async create(dto: CreateTagDto): Promise<TagResponse> {
    const name = dto.name.toLowerCase();
    const resExisting = await this.findByName(name);
    if (resExisting) {
      throw new ConflictException(`Tag "${name}" already exists`);
    }

    const resTag = await this.prisma.tags.create({
      data: { name, color: dto.color },
    });
    return toResponse(resTag);
  }

  async findAll(): Promise<TagResponse[]> {
    const resTags = await this.prisma.tags.findMany({
      orderBy: [{ name: 'asc' }],
    });

    const result: TagResponse[] = [];
    for (const resTag of resTags) {
      result.push(toResponse(resTag));
    }
    return result;
  }

  async update(id: number, dto: UpdateTagDto): Promise<TagResponse> {
    if (!hasAtLeastOneField(dto)) {
      throw new BadRequestException(['Send at least one field to change: name or color']);
    }

    const resExisting = await this.findOne(id);
    if (!resExisting) {
      throw new NotFoundException(`Tag ${id} not found`);
    }

    let name: string | undefined;
    if (dto.name) {
      name = dto.name.toLowerCase();
      const resNameTaken = await this.findByName(name);
      if (resNameTaken && resNameTaken.id !== id) {
        throw new ConflictException(`Tag "${name}" already exists`);
      }
    }

    const resTag = await this.prisma.tags.update({
      where: { id },
      data: { name, color: dto.color },
    });
    return toResponse(resTag);
  }

  async remove(id: number): Promise<void> {
    const resExisting = await this.findOne(id);
    if (!resExisting) {
      throw new NotFoundException(`Tag ${id} not found`);
    }

    await this.prisma.tags.delete({ where: { id } });
  }
}
