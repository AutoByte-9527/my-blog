import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VisitAdminService } from './visit.admin.service';

@Controller('api/admin/visits')
@UseGuards(JwtAuthGuard)
export class VisitAdminController {
  constructor(private visitService: VisitAdminService) {}

  @Get('stats')
  async getStats() {
    return this.visitService.getStats();
  }

  @Get('trend')
  async getTrend(@Query('period') period: 'day' | 'week' | 'month') {
    return this.visitService.getTrend(period || 'day');
  }

  @Get('top-articles')
  async getTopArticles(@Query('limit') limit?: number) {
    return this.visitService.getTopArticles(limit || 10);
  }

  @Get('geo')
  async getGeoStats() {
    return this.visitService.getGeoStats();
  }

  @Get('devices')
  async getDeviceStats() {
    return this.visitService.getDeviceStats();
  }

  @Get('browsers')
  async getBrowserStats() {
    return this.visitService.getBrowserStats();
  }

  @Get('os')
  async getOsStats() {
    return this.visitService.getOsStats();
  }

  @Get('referers')
  async getRefererStats() {
    return this.visitService.getRefererStats();
  }
}