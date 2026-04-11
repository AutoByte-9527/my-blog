import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitLog } from './entities/visit-log.entity';

@Injectable()
export class VisitAdminService {
  constructor(
    @InjectRepository(VisitLog)
    private visitLogRepository: Repository<VisitLog>,
  ) {}

  async getStats() {
    const total = await this.visitLogRepository.count();
    return { total };
  }

  async getTrend(period: 'day' | 'week' | 'month') {
    const now = new Date();
    let dateFormat: string;
    let daysBack: number;

    switch (period) {
      case 'day':
        dateFormat = '%Y-%m-%d %H:00:00';
        daysBack = 1;
        break;
      case 'week':
        dateFormat = '%Y-%m-%d';
        daysBack = 7;
        break;
      case 'month':
        dateFormat = '%Y-%m-%d';
        daysBack = 30;
        break;
    }

    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const result = await this.visitLogRepository
      .createQueryBuilder('visit')
      .select(`strftime('${dateFormat}', visit.visitedAt)`, 'date')
      .addSelect('COUNT(*)', 'count')
      .where('visit.visitedAt >= :startDate', { startDate })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result;
  }

  async getTopArticles(limit = 10) {
    return this.visitLogRepository
      .createQueryBuilder('visit')
      .select('visit.articleId', 'id')
      .addSelect('COUNT(*)', 'count')
      .groupBy('visit.articleId')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getGeoStats() {
    const result = await this.visitLogRepository
      .createQueryBuilder('visit')
      .select('visit.country', 'country')
      .addSelect('visit.city', 'city')
      .addSelect('COUNT(*)', 'count')
      .where('visit.country IS NOT NULL')
      .groupBy('visit.country')
      .addGroupBy('visit.city')
      .orderBy('count', 'DESC')
      .getRawMany();
    return result;
  }

  async getDeviceStats() {
    const result = await this.visitLogRepository
      .createQueryBuilder('visit')
      .select('visit.device', 'device')
      .addSelect('COUNT(*)', 'count')
      .where('visit.device IS NOT NULL')
      .groupBy('visit.device')
      .orderBy('count', 'DESC')
      .getRawMany();
    return result;
  }

  async getBrowserStats() {
    const result = await this.visitLogRepository
      .createQueryBuilder('visit')
      .select('visit.browser', 'browser')
      .addSelect('COUNT(*)', 'count')
      .where('visit.browser IS NOT NULL')
      .groupBy('visit.browser')
      .orderBy('count', 'DESC')
      .getRawMany();
    return result;
  }

  async getOsStats() {
    const result = await this.visitLogRepository
      .createQueryBuilder('visit')
      .select('visit.os', 'os')
      .addSelect('COUNT(*)', 'count')
      .where('visit.os IS NOT NULL')
      .groupBy('visit.os')
      .orderBy('count', 'DESC')
      .getRawMany();
    return result;
  }

  async getRefererStats() {
    const result = await this.visitLogRepository
      .createQueryBuilder('visit')
      .select('visit.referer', 'referer')
      .addSelect('COUNT(*)', 'count')
      .where('visit.referer IS NOT NULL')
      .groupBy('visit.referer')
      .orderBy('count', 'DESC')
      .getRawMany();
    return result;
  }
}