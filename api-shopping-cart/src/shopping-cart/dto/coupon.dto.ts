// src/shopping-cart/dto/coupon.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber } from 'class-validator';

export class CouponDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  couponId: number;

  @IsString()
  @ApiProperty({ example: 'SUMMER2025' })
  couponCode: string;

  @IsNumber()
  @ApiProperty({ example: 50 })
  discountAmount: number;

  @IsInt()
  @ApiProperty({ example: 100 })
  minAmount: number;
}
