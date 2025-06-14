// src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { PagerDto } from './dto/pager.dto';
import { ResponseDto } from './dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Delete } from '@nestjs/common';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

@UseGuards(AuthGuard('jwt'), RolesGuard) // 👈 Usa esto
@Roles('ADMIN')
@Get('check-auth')
getProtectedRoute(@Req() req) {
  console.log('User en request:', req.user);
  return {
    message: 'Acceso permitido',
    user: req.user,
  };
}

  @Get()
  async getAll(): Promise<ResponseDto<ProductDto[]>> {
    return await this.productService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<ResponseDto<ProductDto>> {
    return await this.productService.getById(id);
  }

@Get('all/paginated')
async getPaginated(@Query() pager: PagerDto): Promise<ResponseDto<any>> {
  return await this.productService.getPaginated(pager);
}

  @UseGuards(AuthGuard('jwt'), RolesGuard) // 👈 Usa esto
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './wwwroot/ProductImages',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
      },
    }),
  }))
  async create(
    @Body() productDto: ProductDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ): Promise<ResponseDto<ProductDto>> {
    if (image) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      productDto.imageUrl = `${baseUrl}/ProductImages/${image.filename}`;
      productDto.imageLocalPath = `wwwroot/ProductImages/${image.filename}`;
    } else {
      productDto.imageUrl = 'https://placehold.co/600x400';
      productDto.imageLocalPath = '';
    }

    return await this.productService.create(productDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Put(':id')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './wwwroot/ProductImages',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() productDto: ProductDto,
  @UploadedFile() image: Express.Multer.File,
  @Req() req,
): Promise<ResponseDto<ProductDto>> {
  if (image) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    productDto.imageUrl = `${baseUrl}/ProductImages/${image.filename}`;
    productDto.imageLocalPath = `wwwroot/ProductImages/${image.filename}`;
  }

  return await this.productService.update(id, productDto);
}



@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Delete(':id')
async delete(@Param('id') id: number): Promise<ResponseDto<null>> {
  return await this.productService.delete(id);
}


}
