import { Injectable, Inject, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ICouponService } from '../interfaces/coupon-service.interface';
import { CouponDto } from '../dto/coupon.dto';
import { ResponseDto } from '../dto/response.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CouponService implements ICouponService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('REQUEST') private readonly request: Request
  ) {}

async getCoupon(couponCode: string | undefined): Promise<CouponDto | null> {
  const baseUrl = this.configService.get<string>('COUPON_API_URL');
    
    // Obtener el token del header de la solicitud original
    const authHeader = this.request.headers.authorization;
    if (!authHeader) {
      console.error('No authorization header found');
      return null;
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ResponseDto<CouponDto>>(
          `${baseUrl}/api/coupon/GetByCode/${couponCode}`,
          {
            headers: {
              Authorization: authHeader // Pasar el mismo token
            }
          }
        )
      );

      if (data.isSuccess) {
        return data.result;
      }

      return null;
    } catch (err) {
      console.error('Error fetching coupon:', err.message);
      return null;
    }
  }
}
