import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VisitLog } from "./entities/visit-log.entity";
import { Article } from "../article/entities/article.entity";
import { VisitController } from "./visit.controller";
import { VisitService } from "./visit.service";

@Module({
  imports: [TypeOrmModule.forFeature([VisitLog, Article])],
  controllers: [VisitController],
  providers: [VisitService],
  exports: [VisitService],
})
export class VisitModule {}
