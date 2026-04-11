import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleAdminController } from './article.admin.controller';
import { ArticleAdminService } from './article.admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  controllers: [ArticleController, ArticleAdminController],
  providers: [ArticleService, ArticleAdminService],
  exports: [ArticleService],
})
export class ArticleModule {}
