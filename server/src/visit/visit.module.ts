import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitLog } from './entities/visit-log.entity';
import { Article } from '../article/entities/article.entity';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { VisitAdminController } from './visit.admin.controller';
import { VisitAdminService } from './visit.admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([VisitLog, Article])],
  controllers: [VisitController, VisitAdminController],
  providers: [VisitService, VisitAdminService],
  exports: [VisitService],
})
export class VisitModule {}
