// src/shopping-cart/dto/cart-header.dto.ts
import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartHeaderDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  cartHeaderId: number;

  @IsString()
  @ApiProperty({ example: 'user-123' })
  userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'SUMMER2025' })
  couponCode?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 15.5 })
  discount?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 100.0 })
  cartTotal?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Pablo Martínez' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '+521234567890' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'pablo@example.com' })
  email?: string;
}
