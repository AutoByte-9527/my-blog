import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArticleAdminService } from './article.admin.service';

@Controller('api/admin/articles')
@UseGuards(JwtAuthGuard)
export class ArticleAdminController {
  constructor(private articleService: ArticleAdminService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
  ) {
    return this.articleService.findAll({ page, page_size: pageSize, category, tag });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.articleService.create(data);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.articleService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.remove(id);
  }
}
