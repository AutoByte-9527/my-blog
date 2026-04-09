import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Article } from '../article/entities/article.entity';
import { ArticleService } from '../article/article.service';
import { ArticleListItem } from '@my-blog/shared';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private articleService: ArticleService,
  ) {}

  private formatDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  async search(q: string): Promise<ArticleListItem[]> {
    await this.articleService.syncArticlesToDb();

    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.title LIKE :q', { q: `%${q}%` })
      .orWhere('article.summary LIKE :q', { q: `%${q}%` })
      .orWhere('article.content LIKE :q', { q: `%${q}%` })
      .orderBy('article.createdAt', 'DESC')
      .limit(50)
      .getMany();

    return articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      category: article.category
        ? {
            id: article.category.id,
            name: article.category.name,
            slug: article.category.slug,
            article_count: article.category.articles?.length || 0,
          }
        : null,
      tags:
        article.tags?.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          article_count: t.articles?.length || 0,
        })) || [],
      created_at: this.formatDateTime(article.createdAt),
    }));
  }
}
