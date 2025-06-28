// src/shopping-cart/dto/cart.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CartHeaderDto } from './cart-header.dto';
import { CartDetailsDto } from './cart-details.dto';

export class CartDto {
  @ValidateNested()
  @Type(() => CartHeaderDto)
  @ApiProperty({ type: CartHeaderDto })
  cartHeader: CartHeaderDto;

  @ValidateNested({ each: true })
  @Type(() => CartDetailsDto)
  @ApiProperty({ type: [CartDetailsDto] })
  cartDetailsDtos: CartDetailsDto[];
}
