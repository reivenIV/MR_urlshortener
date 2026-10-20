import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateFolderDto } from './dto/create_folder.dto.js';
import { UpdateFolderDto } from './dto/update_folder.dto.js';
import { FoldersService } from './folders.service.js';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(@Body() dto: CreateFolderDto) {
    return this.foldersService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.foldersService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFolderDto) {
    return this.foldersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foldersService.remove(id);
  }
}
