import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagAdminController } from './tag.admin.controller';
import { TagService } from './tag.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), ArticleModule],
  controllers: [TagController, TagAdminController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
