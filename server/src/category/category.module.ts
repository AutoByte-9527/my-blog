import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { ArticleModule } from "../article/article.module";

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ArticleModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
