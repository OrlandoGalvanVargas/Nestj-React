// src/coupon/coupon.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { CouponDto } from './dto/coupon.dto';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async getAll(): Promise<ResponseDto<CouponDto[]>> {
    const response = new ResponseDto<CouponDto[]>();
    try {
      const coupons = await this.couponRepository.find();
      response.result = coupons;  // Si quieres mapear a DTO explícitamente, hacemos aquí
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }


    async getById(id: number): Promise<ResponseDto<CouponDto>> {
    const response = new ResponseDto<CouponDto>();
    try {
      const coupon = await this.couponRepository.findOneBy({ couponId: id });
      if (!coupon) throw new NotFoundException('Cupón no encontrado');
      response.result = coupon; // Aquí podrías mapear a DTO si quieres
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }

  async getByCode(code: string): Promise<ResponseDto<CouponDto>> {
    const response = new ResponseDto<CouponDto>();
    try {
      const coupon = await this.couponRepository
        .createQueryBuilder('coupon')
        .where('LOWER(coupon.couponCode) = LOWER(:code)', { code })
        .getOne();

      if (!coupon) {
        response.isSuccess = false;
        response.message = 'Cupón no encontrado';
        return response;
      }

      response.result = coupon; // o hacer un mapeo explícito si usas DTOs
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }

  async create(couponDto: CouponDto): Promise<ResponseDto<CouponDto>> {
    const response = new ResponseDto<CouponDto>();
    try {
      const coupon = this.couponRepository.create(couponDto);
      const savedCoupon = await this.couponRepository.save(coupon);

      response.result = savedCoupon; // o mapear a DTO si usas class-transformer
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }

   async update(couponDto: CouponDto): Promise<ResponseDto<CouponDto>> {
    const response = new ResponseDto<CouponDto>();
    try {
      // Suponiendo que couponDto tiene el ID para buscar
      const coupon = await this.couponRepository.findOneBy({ couponId: couponDto.couponId });
      if (!coupon) {
        response.isSuccess = false;
        response.message = 'Coupon not found';
        return response;
      }

      // Actualiza el objeto con los datos del DTO
      this.couponRepository.merge(coupon, couponDto);
      const updatedCoupon = await this.couponRepository.save(coupon);

      response.result = updatedCoupon; // O mapear a DTO si usas class-transformer
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }

  async delete(id: number): Promise<ResponseDto<null>> {
    const response = new ResponseDto<null>();
    try {
      const coupon = await this.couponRepository.findOneBy({ couponId: id });
      if (!coupon) {
        response.isSuccess = false;
        response.message = 'Coupon not found';
        return response;
      }

      await this.couponRepository.remove(coupon);
      // No Stripe call

    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }
}
