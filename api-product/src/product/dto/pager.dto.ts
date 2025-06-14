// src/product/dto/pager.dto.ts
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PagerDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  recordsPerPage: number = 10;

  @IsOptional()
  sortBy?: string;  // ejemplo: 'name', 'price'

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';  // 'ASC' o 'DESC'
}

