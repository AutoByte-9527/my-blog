import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { ArticleService } from '../article/article.service';
import { Tag as TagType } from '@my-blog/shared';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private articleService: ArticleService,
  ) {}

  async findAll(): Promise<TagType[]> {
    await this.articleService.syncArticlesToDb();

    const tags = await this.tagRepository.find({
      relations: ['articles'],
    });

    return tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      article_count: t.articles?.length || 0,
    }));
  }
}
