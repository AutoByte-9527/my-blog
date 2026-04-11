import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Controller('api/admin/tags')
@UseGuards(JwtAuthGuard)
export class TagAdminController {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  @Get()
  async findAll() {
    return this.tagRepository.find();
  }

  @Post()
  async create(@Body() data: { name: string; slug?: string }) {
    const tag = this.tagRepository.create(data);
    return this.tagRepository.save(tag);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: { name: string; slug?: string }) {
    await this.tagRepository.update(id, data);
    return this.tagRepository.findOne({ where: { id } });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tagRepository.delete(id);
  }
}