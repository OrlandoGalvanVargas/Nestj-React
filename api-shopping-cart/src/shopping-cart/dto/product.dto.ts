// src/shopping-cart/dto/product.dto.ts
import { IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @IsInt()
  @ApiProperty({ example: 101 })
  productId: number;

  @IsString()
  @ApiProperty({ example: 'Smartphone' })
  name: string;

  @IsNumber()
  @ApiProperty({ example: 499.99 })
  price: number;

  @IsString()
  @ApiProperty({ example: 'Latest model smartphone with 128GB storage.' })
  description: string;

  @IsString()
  @ApiProperty({ example: 'Electronics' })
  cateroryName: string;

  @IsString()
  @ApiProperty({ example: 'https://example.com/images/product101.jpg' })
  imageUrl: string;
}
