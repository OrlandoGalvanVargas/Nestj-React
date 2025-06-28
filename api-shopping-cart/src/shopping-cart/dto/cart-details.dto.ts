// src/shopping-cart/dto/cart-details.dto.ts
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CartHeaderDto } from './cart-header.dto';
import { ProductDto } from './product.dto';

export class CartDetailsDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  cartDetailsId: number;

  @IsInt()
  @ApiProperty({ example: 1 })
  cartHeaderId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CartHeaderDto)
  cartHeader?: CartHeaderDto;

  @IsInt()
  @ApiProperty({ example: 101 })
  productId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDto)
  productDto?: ProductDto;

  @IsInt()
  @ApiProperty({ example: 2 })
  count: number;
}
