import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { VisitModule } from './visit/visit.module';
import { SearchModule } from './search/search.module';
import { MarkdownModule } from './markdown/markdown.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { Article } from './article/entities/article.entity';
import { Category } from './category/entities/category.entity';
import { Tag } from './tag/entities/tag.entity';
import { VisitLog } from './visit/entities/visit-log.entity';
import { AdminUser } from './auth/entities/admin-user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'blog.db',
      entities: [Article, Category, Tag, VisitLog, AdminUser],
      synchronize: process.env.NODE_ENV !== 'production',
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    MarkdownModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    VisitModule,
    SearchModule,
    AuthModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
