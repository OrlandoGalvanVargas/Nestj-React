// src/shopping-cart/services/shopping-cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartHeader } from '../entities/cart-header.entity';
import { CartDetails } from '../entities/cart-details.entity';
import { CartDto } from '../dto/cart.dto';
import { CartDetailsDto } from '../dto/cart-details.dto';
import { CartHeaderDto } from '../dto/cart-header.dto';
import { ProductService } from './product.service';
import { CouponService } from './coupon.service';
import { ResponseDto } from '../dto/response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(CartHeader)
    private cartHeaderRepo: Repository<CartHeader>,

    @InjectRepository(CartDetails)
    private cartDetailsRepo: Repository<CartDetails>,

    private readonly productService: ProductService,
    private readonly couponService: CouponService,
  ) {}

async applyCoupon(cartDto: CartDto): Promise<ResponseDto<boolean>> {
  const response = new ResponseDto<boolean>();
  try {
    const cartHeader = await this.cartHeaderRepo.findOneBy({ userId: cartDto.cartHeader.userId });

    if (!cartHeader) {
      response.isSuccess = false;
      response.message = 'Cart not found for user';
      return response;
    }

    // Primero validar si el cupón existe
    const coupon = await this.couponService.getCoupon(cartDto.cartHeader.couponCode);
    if (!coupon) {
      response.isSuccess = false;
      response.message = 'Cupón no válido o no encontrado';
      return response;
    }

    // Obtener detalles del carrito para calcular el total
    const cartDetails = await this.cartDetailsRepo.findBy({ cartHeaderId: cartHeader.cartHeaderId });
    const productList = await this.productService.getProducts();

    let cartTotal = 0;
    for (const item of cartDetails) {
      const product = productList.find(p => p.productId === item.productId);
      if (product) {
        cartTotal += item.count * product.price;
      }
    }

    // Verificar si el carrito cumple con el monto mínimo del cupón
    if (cartTotal < coupon.minAmount) {
      response.isSuccess = false;
      response.message = `El carrito no alcanza el monto mínimo requerido (${coupon.minAmount})`;
      return response;
    }

    // Calcular el descuento como porcentaje
    const discountAmount = (cartTotal * coupon.discountAmount) / 100;
    const finalTotal = cartTotal - discountAmount;

    // Actualizar el carrito solo si todas las validaciones pasan
    cartHeader.couponCode = cartDto.cartHeader.couponCode;
    cartHeader.discount = discountAmount; // Guardamos el monto del descuento
    cartHeader.cartTotal = finalTotal;

    await this.cartHeaderRepo.save(cartHeader);

    response.result = true;
    response.message = 'Cupón aplicado correctamente';
  } catch (err) {
    response.isSuccess = false;
    response.message = err.message;
  }
  return response;
}

async removeCoupon(cartDto: CartDto): Promise<ResponseDto<boolean>> {
  const response = new ResponseDto<boolean>();
  try {
    const cartHeader = await this.cartHeaderRepo.findOneByOrFail({ userId: cartDto.cartHeader.userId });
    
    // Obtener detalles del carrito para recalcular el total
    const cartDetails = await this.cartDetailsRepo.findBy({ cartHeaderId: cartHeader.cartHeaderId });
    const productList = await this.productService.getProducts();

    // Calcular el nuevo total sin descuento
    let newCartTotal = 0;
    for (const item of cartDetails) {
      const product = productList.find(p => p.productId === item.productId);
      if (product) {
        newCartTotal += item.count * product.price;
      }
    }

    // Actualizar los campos del carrito
    cartHeader.couponCode = '';
    cartHeader.discount = 0;
    cartHeader.cartTotal = newCartTotal;

    await this.cartHeaderRepo.save(cartHeader);
    response.result = true;
  } catch (err) {
    response.isSuccess = false;
    response.message = err.message;
  }
  return response;
}
async getCart(userId: string): Promise<ResponseDto<CartDto>> {
  const response = new ResponseDto<CartDto>();
  try {
    const cartHeader = await this.cartHeaderRepo.findOneBy({ userId });
    
    if (!cartHeader) {
      response.isSuccess = false;
      response.message = 'Cart not found for user';
      return response;
    }

    const cartDetails = await this.cartDetailsRepo.findBy({ cartHeaderId: cartHeader.cartHeaderId });

    if (cartDetails.length === 0) {
      const emptyCart: CartDto = {
        cartHeader: { 
          ...plainToInstance(CartHeaderDto, cartHeader), 
          cartTotal: 0, 
          discount: 0 
        },
        cartDetailsDtos: [],
      };
      response.result = emptyCart;
      return response;
    }

    const productList = await this.productService.getProducts();
    
    const mappedDetails: CartDetailsDto[] = cartDetails.map(detail => {
      const product = productList.find(p => p.productId === detail.productId);
      
      return {
        cartDetailsId: detail.cartDetailsId,
        cartHeaderId: detail.cartHeaderId,
        productId: detail.productId,
        productDto: product,
        count: detail.count,
        cartHeader: plainToInstance(CartHeaderDto, cartHeader),
      };
    });

    let cartTotal = mappedDetails.reduce((sum, d) => {
      const price = d.productDto?.price ?? 0;
      return sum + (price * d.count);
    }, 0);

    let discount = 0;
    if (cartHeader.couponCode) {
      const coupon = await this.couponService.getCoupon(cartHeader.couponCode);
      if (coupon && cartTotal > coupon.minAmount) {
        // Aplicar descuento porcentual
        discount = (cartTotal * coupon.discountAmount) / 100;
        cartTotal -= discount;
      }
    }

    const cartDto: CartDto = {
      cartHeader: { 
        ...plainToInstance(CartHeaderDto, cartHeader), 
        cartTotal, 
        discount 
      },
      cartDetailsDtos: mappedDetails,
    };

    response.result = cartDto;
  } catch (err) {
    response.isSuccess = false;
    response.message = err.message;
  }
  return response;
}

 // 2. Agregar validación de productos en CartUpsert
async cartUpsert(cartDto: CartDto): Promise<ResponseDto<CartDto>> {
  const response = new ResponseDto<CartDto>();
  try {
    // Validar si el producto existe antes de agregarlo
    const products = await this.productService.getProducts();
    const productExists = products.find(p => p.productId === cartDto.cartDetailsDtos[0].productId);
    
    if (!productExists) {
      response.isSuccess = false;
      response.message = 'Product not found';
      return response;
    }

    let header = await this.cartHeaderRepo.findOneBy({ userId: cartDto.cartHeader.userId });

    if (!header) {
      header = this.cartHeaderRepo.create({
        userId: cartDto.cartHeader.userId,
        couponCode: cartDto.cartHeader.couponCode || '',
      });
      header = await this.cartHeaderRepo.save(header);
    }

    const detailDto = cartDto.cartDetailsDtos[0];
    let detail = await this.cartDetailsRepo.findOneBy({
      cartHeaderId: header.cartHeaderId,
      productId: detailDto.productId,
    });

    if (!detail) {
      detail = this.cartDetailsRepo.create({
        cartHeaderId: header.cartHeaderId,
        productId: detailDto.productId,
        count: detailDto.count,
      });
    } else {
      detail.count += detailDto.count;
    }

    await this.cartDetailsRepo.save(detail);
    // Recalcular totales y guardar en DB
const updated = await this.getCart(cartDto.cartHeader.userId);
const updatedHeader = await this.cartHeaderRepo.findOneBy({ userId: cartDto.cartHeader.userId });

if (updatedHeader && updated.result) {
  updatedHeader.cartTotal = updated.result.cartHeader.cartTotal;
  updatedHeader.discount = updated.result.cartHeader.discount;
  await this.cartHeaderRepo.save(updatedHeader);
}

    // Retornar el carrito actualizado con totales calculados
    const updatedCart = await this.getCart(cartDto.cartHeader.userId);
    response.result = updatedCart.result;
  } catch (err) {
    response.isSuccess = false;
    response.message = err.message;
  }
  return response;
}

async removeCart(cartDetailsId: number): Promise<ResponseDto<boolean>> {
  const response = new ResponseDto<boolean>();
  try {
    // 1. Encontrar el detalle del carrito
    const detail = await this.cartDetailsRepo.findOneByOrFail({ 
      cartDetailsId 
    });
    
    // 2. Reducir la cantidad o eliminar
    if (detail.count > 1) {
      // Si hay más de 1 unidad, solo reducir la cantidad
      detail.count -= 1;
      await this.cartDetailsRepo.save(detail);
    } else {
      // Si solo hay 1 unidad, eliminar el detalle
      await this.cartDetailsRepo.remove(detail);
    }

    const cartHeaderId = detail.cartHeaderId;
    
    // 3. Verificar si era el último producto y eliminar el header si es necesario
    const remainingDetails = await this.cartDetailsRepo.countBy({ cartHeaderId });
    
    if (remainingDetails === 0) {
      const header = await this.cartHeaderRepo.findOneBy({ cartHeaderId });
      if (header) {
        await this.cartHeaderRepo.remove(header);
      }
      response.result = true;
      return response;
    }

    // 4. Recalcular el total del carrito si aún hay productos
    const cartHeader = await this.cartHeaderRepo.findOneBy({ cartHeaderId });
    if (!cartHeader) {
      response.result = true;
      return response;
    }

    const cartDetails = await this.cartDetailsRepo.findBy({ cartHeaderId });
    const productList = await this.productService.getProducts();

    // Calcular nuevo total
    let newCartTotal = 0;
    for (const item of cartDetails) {
      const product = productList.find(p => p.productId === item.productId);
      if (product) {
        newCartTotal += item.count * product.price;
      }
    }

    // Recalcular descuento si hay cupón
    let discount = 0;
 // En ambos métodos, cambiar esta parte:
if (cartHeader.couponCode) {
  const coupon = await this.couponService.getCoupon(cartHeader.couponCode);
  if (coupon && newCartTotal >= coupon.minAmount) {
    // Cambiar de cantidad fija a porcentaje
    discount = (newCartTotal * coupon.discountAmount) / 100;
    newCartTotal -= discount;
  } else {
    cartHeader.couponCode = '';
  }
}

    // Actualizar el header
    cartHeader.cartTotal = newCartTotal;
    cartHeader.discount = discount;
    await this.cartHeaderRepo.save(cartHeader);

    response.result = true;
  } catch (err) {
    response.isSuccess = false;
    response.message = err.message;
  }
  return response;
}

async removeCartItem(cartDetailsId: number): Promise<ResponseDto<boolean>> {
  const response = new ResponseDto<boolean>();
  try {
    // 1. Encontrar y eliminar el detalle del carrito
    const detail = await this.cartDetailsRepo.findOneByOrFail({ 
      cartDetailsId 
    });
    await this.cartDetailsRepo.remove(detail);

    const cartHeaderId = detail.cartHeaderId;
    
    // 2. Verificar si era el último producto y eliminar el header si es necesario
    const remainingDetails = await this.cartDetailsRepo.countBy({ cartHeaderId });
    
    if (remainingDetails === 0) {
      const header = await this.cartHeaderRepo.findOneBy({ cartHeaderId });
      if (header) {
        await this.cartHeaderRepo.remove(header);
      }
      response.result = true;
      return response;
    }

    // 3. Recalcular el total del carrito si aún hay productos
    const cartHeader = await this.cartHeaderRepo.findOneBy({ cartHeaderId });
    if (!cartHeader) {
      response.result = true;
      return response;
    }

    const cartDetails = await this.cartDetailsRepo.findBy({ cartHeaderId });
    const productList = await this.productService.getProducts();

    // Calcular nuevo total
    let newCartTotal = 0;
    for (const item of cartDetails) {
      const product = productList.find(p => p.productId === item.productId);
      if (product) {
        newCartTotal += item.count * product.price;
      }
    }

    // Recalcular descuento si hay cupón
    let discount = 0;
 // En ambos métodos, cambiar esta parte:
if (cartHeader.couponCode) {
  const coupon = await this.couponService.getCoupon(cartHeader.couponCode);
  if (coupon && newCartTotal >= coupon.minAmount) {
    // Cambiar de cantidad fija a porcentaje
    discount = (newCartTotal * coupon.discountAmount) / 100;
    newCartTotal -= discount;
  } else {
    cartHeader.couponCode = '';
  }
}

    // Actualizar el header
    cartHeader.cartTotal = newCartTotal;
    cartHeader.discount = discount;
    await this.cartHeaderRepo.save(cartHeader);

    response.result = true;
  } catch (err) {
    response.isSuccess = false;
    response.message = err.message;
  }
  return response;
}
}
