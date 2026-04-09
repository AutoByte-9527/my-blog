import { Controller, Get, Param, Query } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleResponseDto, ArticleDetailResponseDto } from "./dto/article-response.dto";

@Controller("api/articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @Query("category") category?: string,
    @Query("tag") tag?: string,
    @Query("page") page?: string,
    @Query("page_size") pageSize?: string
  ): Promise<ArticleResponseDto[]> {
    return this.articleService.findAll({
      category,
      tag,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string): Promise<ArticleDetailResponseDto> {
    return this.articleService.findBySlug(slug);
  }
}
