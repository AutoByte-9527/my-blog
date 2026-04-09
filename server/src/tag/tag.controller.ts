import { Controller, Get } from "@nestjs/common";
import { TagService } from "./tag.service";
import { Tag } from "@my-blog/shared";

@Controller("api/tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }
}
