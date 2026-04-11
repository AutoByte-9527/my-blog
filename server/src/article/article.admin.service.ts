import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleAdminService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(params: { page?: number; page_size?: number; category?: string; tag?: string }) {
    const page = Number(params.page) || 1;
    const pageSize = Number(params.page_size) || 10;
    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .orderBy('article.createdAt', 'DESC');

    if (params.category) {
      qb.andWhere('category.slug = :category', { category: params.category });
    }

    if (params.tag) {
      qb.andWhere('tags.slug = :tag', { tag: params.tag });
    }

    const [data, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });
    if (!article) throw new NotFoundException('文章不存在');
    return article;
  }

  async create(data: Partial<Article>) {
    const article = this.articleRepository.create(data);
    return this.articleRepository.save(article);
  }

  async update(id: number, data: Partial<Article>) {
    const article = await this.findOne(id);
    Object.assign(article, data);
    return this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }
}
