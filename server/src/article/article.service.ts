import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';
import { MarkdownService } from '../markdown/markdown.service';
import {
  ArticleResponseDto,
  ArticleDetailResponseDto,
} from './dto/article-response.dto';

@Injectable()
export class ArticleService implements OnModuleInit {
  private initialized = false;

  async onModuleInit() {
    if (!this.initialized) {
      console.log('Syncing articles to database on startup...');
      await this.syncArticlesToDb();
      this.initialized = true;
      console.log('Article sync completed.');
    }
  }
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private markdownService: MarkdownService,
  ) {}

  private toResponseDto(article: Article): ArticleResponseDto {
    const tags =
      article.tags?.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        article_count: t.articles?.length || 0,
      })) || [];

    const category = article.category
      ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug,
          article_count: article.category.articles?.length || 0,
        }
      : null;

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      category,
      tags,
      created_at: article.createdAt.toISOString(),
    };
  }

  private toDetailResponseDto(article: Article): ArticleDetailResponseDto {
    return {
      ...this.toResponseDto(article),
      content: article.content,
      updated_at: article.updatedAt.toISOString(),
    };
  }

  async syncArticlesToDb(): Promise<void> {
    const mdArticles = this.markdownService.getArticlesFromCache();

    for (const mdArticle of mdArticles) {
      const existing = await this.articleRepository.findOne({
        where: { slug: mdArticle.slug },
      });

      if (existing) continue;

      let category = await this.categoryRepository.findOne({
        where: { name: mdArticle.category_name },
      });

      if (!category) {
        category = this.categoryRepository.create({
          name: mdArticle.category_name,
          slug: mdArticle.category_name.toLowerCase(),
        });
        category = await this.categoryRepository.save(category);
      }

      const article = this.articleRepository.create({
        slug: mdArticle.slug,
        title: mdArticle.title,
        content: mdArticle.content,
        summary: mdArticle.summary,
        category,
        createdAt: mdArticle.created_at,
      });

      article.tags = [];

      for (const tagName of mdArticle.tags) {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });
        if (!tag) {
          tag = this.tagRepository.create({
            name: tagName,
            slug: tagName.toLowerCase(),
          });
          tag = await this.tagRepository.save(tag);
        }
        article.tags.push(tag);
      }

      await this.articleRepository.save(article);
    }
  }

  async findAll(options: {
    category?: string;
    tag?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ArticleResponseDto[]> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;

    let query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .orderBy('article.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (options.category) {
      query = query.where('category.slug = :category', {
        category: options.category,
      });
    }

    if (options.tag) {
      query = query
        .innerJoin('article.tags', 'tag')
        .where('tag.slug = :tag', { tag: options.tag });
    }

    const articles = await query.getMany();
    return articles.map((a) => this.toResponseDto(a));
  }

  async findBySlug(slug: string): Promise<ArticleDetailResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['category', 'tags'],
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    return this.toDetailResponseDto(article);
  }
}
