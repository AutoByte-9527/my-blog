import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Controller('api/admin/categories')
@UseGuards(JwtAuthGuard)
export class CategoryAdminController {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  @Get()
  async findAll() {
    return this.categoryRepository.find();
  }

  @Post()
  async create(@Body() data: { name: string; slug?: string }) {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: { name: string; slug?: string }) {
    await this.categoryRepository.update(id, data);
    return this.categoryRepository.findOne({ where: { id } });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoryRepository.delete(id);
  }
}