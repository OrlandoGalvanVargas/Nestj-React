import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IProductService } from '../interfaces/product-service.interface';
import { ProductDto } from '../dto/product.dto';
import { ResponseDto } from '../dto/response.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getProducts(): Promise<ProductDto[]> {
    const baseUrl = this.configService.get<string>('PRODUCT_API_URL');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ResponseDto<ProductDto[]>>(
          `${baseUrl}/api/product`,
        ),
      );

      if (data.isSuccess) {
        return data.result;
      }

      return [];
    } catch (err) {
      console.error('Error fetching products:', err.message);
      return [];
    }
  }
}
