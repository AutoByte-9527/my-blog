import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitLog } from './entities/visit-log.entity';
import { Article } from '../article/entities/article.entity';
import { MarkdownService } from '../markdown/markdown.service';
import { CreateVisitDto } from './dto/create-visit.dto';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitLog)
    private visitLogRepository: Repository<VisitLog>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private markdownService: MarkdownService,
  ) {}

  private getRealIp(request: any): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      return ips.split(',')[0].trim();
    }
    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }
    return request.ip || request.socket.remoteAddress || '127.0.0.1';
  }

  async create(
    dto: CreateVisitDto,
    request: any,
  ): Promise<{ message: string }> {
    const userAgent = request.headers['user-agent'] || '';

    if (!this.markdownService.isValidUserAgent(userAgent)) {
      throw new BadRequestException('无效的 User-Agent');
    }

    const article = await this.articleRepository.findOne({
      where: { id: dto.article_id },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    const uaInfo = this.markdownService.parseUserAgent(userAgent);

    const visitLog = this.visitLogRepository.create({
      articleId: dto.article_id,
      ip: this.getRealIp(request),
      userAgent,
      referer: dto.referer,
      country: dto.country,
      city: dto.city,
      device: uaInfo.device,
      browser: uaInfo.browser,
      os: uaInfo.os,
    });

    await this.visitLogRepository.save(visitLog);

    // Increment article view count
    await this.articleRepository.increment(
      { id: dto.article_id },
      'viewCount',
      1,
    );

    return { message: '访问记录成功' };
  }

  async getTotalStats(): Promise<{ total: number }> {
    const result = await this.articleRepository
      .createQueryBuilder('article')
      .select('SUM(article.viewCount)', 'total')
      .getRawOne();
    return { total: parseInt(result?.total || '0', 10) };
  }
}
