// src/coupon/coupon.controller.ts
import { Controller, Get, UseGuards, Req, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ResponseDto } from './dto/response.dto';
import { CouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<ResponseDto<CouponDto[]>> {
    return await this.couponService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: number): Promise<ResponseDto<CouponDto>> {
    return await this.couponService.getById(id);
  }

   @UseGuards(JwtAuthGuard)
  @Get('GetByCode/:code')
  async getByCode(@Param('code') code: string): Promise<ResponseDto<CouponDto>> {
    return await this.couponService.getByCode(code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENTAS')
  @Post()
  async create(@Body() couponDto: CouponDto): Promise<ResponseDto<CouponDto>> {
    return await this.couponService.create(couponDto);
  }

   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put()
  async update(@Body() couponDto: CouponDto): Promise<ResponseDto<CouponDto>> {
    return await this.couponService.update(couponDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ResponseDto<null>> {
    return await this.couponService.delete(id);
  }
}
