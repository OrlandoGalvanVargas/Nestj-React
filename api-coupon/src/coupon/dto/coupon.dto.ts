// src/coupon/dto/coupon.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CouponDto {
  @IsOptional()
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

  @IsDateString()
  @ApiProperty({ example: '2025-06-06T00:00:00Z' })
  lastUpdated: Date;

  @IsString()
  @ApiProperty({ example: 'Percentage' }) // o "Fixed"
  amountType: string;

  @IsInt()
  @ApiProperty({ example: 10 })
  limitUser: number;

  @IsDateString()
  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  dateInit: Date;

  @IsDateString()
  @ApiProperty({ example: '2025-07-01T00:00:00Z' })
  dateEnd: Date;

  @IsString()
  @ApiProperty({ example: 'Electronics' })
  category: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  stateCoupon: boolean;
}
