import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport'; // <-- Agrega esto
import { JwtModule } from '@nestjs/jwt'; // <-- Agrega esto también

import { CartHeader } from './entities/cart-header.entity';
import { CartDetails } from './entities/cart-details.entity';

import { ShoppingCartService } from './services/shopping-cart.service';
import { CouponService } from './services/coupon.service';
import { ProductService } from './services/product.service';
import { ShoppingCartController } from './controllers/shopping-cart.controller';

import { JwtStrategy } from '../auth/jwt.strategy'; // <-- Asegúrate de la ruta
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    HttpModule,
    PassportModule, // <-- Necesario para estrategias
    JwtModule.register({}), // <-- Puedes dejar vacío si no generas tokens aquí
    TypeOrmModule.forFeature([CartHeader, CartDetails]),
  ],
  controllers: [ShoppingCartController],
  providers: [
    ShoppingCartService,
    CouponService,
    ProductService,
    JwtStrategy, // <-- Aquí registras la estrategia
    JwtAuthGuard,
  ],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
