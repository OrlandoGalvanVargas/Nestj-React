// src/shopping-cart/mappers/cart.mapper.ts
import { CartHeader } from '../entities/cart-header.entity';
import { CartHeaderDto } from '../dto/cart-header.dto';
import { CartDetails } from '../entities/cart-details.entity';
import { CartDetailsDto } from '../dto/cart-details.dto';

export class CartMapper {
  static toCartHeaderDto(entity: CartHeader): CartHeaderDto {
    return {
      cartHeaderId: entity.cartHeaderId,
      userId: entity.userId,
      couponCode: entity.couponCode,
      discount: entity.discount ?? 0,
      cartTotal: entity.cartTotal ?? 0,
      name: '', // si tienes en DB, agrégalo aquí
      phone: '',
      email: '',
    };
  }

  static toCartDetailsDto(entity: CartDetails): CartDetailsDto {
    return {
      cartDetailsId: entity.cartDetailsId,
      cartHeaderId: entity.cartHeaderId,
      productId: entity.productId,
      count: entity.count,
      cartHeader: entity.cartHeader ? this.toCartHeaderDto(entity.cartHeader) : undefined,
      productDto: undefined, // vendrá del microservicio de productos
    };
  }

  static toCartHeaderEntity(dto: CartHeaderDto): CartHeader {
    const entity = new CartHeader();
    entity.cartHeaderId = dto.cartHeaderId;
    entity.userId = dto.userId;
    entity.couponCode = dto.couponCode;
    entity.discount = dto.discount;
    entity.cartTotal = dto.cartTotal;
    return entity;
  }

  static toCartDetailsEntity(dto: CartDetailsDto): CartDetails {
    const entity = new CartDetails();
    entity.cartDetailsId = dto.cartDetailsId;
    entity.cartHeaderId = dto.cartHeaderId;
    entity.productId = dto.productId;
    entity.count = dto.count;
    return entity;
  }
}
