import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../article/entities/article.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), ArticleModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
