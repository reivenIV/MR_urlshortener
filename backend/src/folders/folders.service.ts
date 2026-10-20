import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hasAtLeastOneField } from '../common/common_validators.js';
import { type folders } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFolderDto } from './dto/create_folder.dto.js';
import { UpdateFolderDto } from './dto/update_folder.dto.js';

export type FolderResponse = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
};

function toResponse(resFolder: folders): FolderResponse {
  return {
    id: resFolder.id,
    name: resFolder.name,
    description: resFolder.description,
    created_at: resFolder.created_at,
  };
}

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) {}

  // null if no folder has this id
  async findOne(id: number): Promise<folders | null> {
    const resFolder = await this.prisma.folders.findUnique({ where: { id } });
    return resFolder;
  }

  async create(dto: CreateFolderDto): Promise<FolderResponse> {
    const resFolder = await this.prisma.folders.create({
      data: {
        name: dto.name.toLowerCase(),
        description: dto.description,
      },
    });
    return toResponse(resFolder);
  }

  async findAll(): Promise<FolderResponse[]> {
    const resFolders = await this.prisma.folders.findMany({
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
    });

    const result: FolderResponse[] = [];
    for (const resFolder of resFolders) {
      result.push(toResponse(resFolder));
    }
    return result;
  }

  async update(id: number, dto: UpdateFolderDto): Promise<FolderResponse> {
    if (!hasAtLeastOneField(dto)) {
      throw new BadRequestException(['Send at least one field to change: name or description']);
    }

    const resExisting = await this.findOne(id);
    if (!resExisting) {
      throw new NotFoundException(`Folder ${id} not found`);
    }

    let name: string | undefined;
    if (dto.name) {
      name = dto.name.toLowerCase();
    }

    const resFolder = await this.prisma.folders.update({
      where: { id },
      data: { name, description: dto.description },
    });
    return toResponse(resFolder);
  }

  async remove(id: number): Promise<void> {
    const resExisting = await this.findOne(id);
    if (!resExisting) {
      throw new NotFoundException(`Folder ${id} not found`);
    }

    await this.prisma.folders.delete({ where: { id } });
  }
}
