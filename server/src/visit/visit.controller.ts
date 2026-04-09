import { Controller, Post, Body, Req } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { VisitService } from "./visit.service";
import { CreateVisitDto } from "./dto/create-visit.dto";

@Controller("api/visits")
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async create(
    @Body() dto: CreateVisitDto,
    @Req() request: any
  ): Promise<{ message: string }> {
    return this.visitService.create(dto, request);
  }
}
