import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { CartDto } from '../dto/cart.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ResponseDto } from '../dto/response.dto';

@Controller('api/cart')
@UseGuards(JwtAuthGuard)
export class ShoppingCartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  @Post('ApplyCoupon')
  async applyCoupon(@Body() cartDto: CartDto): Promise<ResponseDto<boolean>> {
    return await this.cartService.applyCoupon(cartDto);
  }

  @Post('RemoveCoupon')
  async removeCoupon(@Body() cartDto: CartDto): Promise<ResponseDto<boolean>> {
    return await this.cartService.removeCoupon(cartDto);
  }

  @Get('GetCart/:userId')
  async getCart(@Param('userId') userId: string): Promise<ResponseDto<CartDto>> {
    return await this.cartService.getCart(userId);
  }

  @Post('CartUpsert')
  async cartUpsert(@Body() cartDto: CartDto): Promise<ResponseDto<CartDto>> {
    return await this.cartService.cartUpsert(cartDto);
  }

  @Post('RemoveCart')
async removeCart(@Body() body: { cartDetailsId: number }): Promise<ResponseDto<boolean>> {
  return await this.cartService.removeCart(body.cartDetailsId);
}

@Post('RemoveCartItem')
async removeCartItem(@Body() body: { cartDetailsId: number }): Promise<ResponseDto<boolean>> {
  return await this.cartService.removeCartItem(body.cartDetailsId);
}
}
