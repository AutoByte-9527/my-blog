import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { ArticleService } from '../article/article.service';
import { Category as CategoryType } from '@my-blog/shared';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private articleService: ArticleService,
  ) {}

  async findAll(): Promise<CategoryType[]> {
    await this.articleService.syncArticlesToDb();

    const categories = await this.categoryRepository.find({
      relations: ['articles'],
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      article_count: c.articles?.length || 0,
    }));
  }
}
