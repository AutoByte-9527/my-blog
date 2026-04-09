import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { VisitModule } from './visit/visit.module';
import { SearchModule } from './search/search.module';
import { MarkdownModule } from './markdown/markdown.module';
import { Article } from './article/entities/article.entity';
import { Category } from './category/entities/category.entity';
import { Tag } from './tag/entities/tag.entity';
import { VisitLog } from './visit/entities/visit-log.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'blog.db',
      entities: [Article, Category, Tag, VisitLog],
      synchronize: process.env.NODE_ENV !== 'production',
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    MarkdownModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    VisitModule,
    SearchModule,
  ],
})
export class AppModule {}
