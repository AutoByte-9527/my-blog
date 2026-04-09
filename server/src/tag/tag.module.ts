import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), ArticleModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
