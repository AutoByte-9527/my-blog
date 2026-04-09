import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateVisitDto {
  @IsInt()
  article_id: number;

  @IsString()
  @IsOptional()
  referer?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;
}
