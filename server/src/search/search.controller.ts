import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ArticleListItem } from '@my-blog/shared';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string): Promise<ArticleListItem[]> {
    return this.searchService.search(q);
  }
}
