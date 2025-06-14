// src/product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { ResponseDto } from './dto/response.dto';
import { PagerDto } from './dto/pager.dto';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<ResponseDto<ProductDto[]>> {
    const response = new ResponseDto<ProductDto[]>();
    try {
      const products = await this.productRepository.find();
      response.result = products;
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }

  async getById(id: number): Promise<ResponseDto<ProductDto>> {
    const response = new ResponseDto<ProductDto>();
    try {
      const product = await this.productRepository.findOneBy({ productId: id });
      if (!product) throw new NotFoundException('Producto no encontrado');
      response.result = product;
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }

async getPaginated(pager: PagerDto): Promise<ResponseDto<{
  products: ProductDto[],
  totalRecords: number,
  totalPages: number,
  currentPage: number
}>> {
  const response = new ResponseDto<any>();
  try {
    const skip = (pager.page - 1) * pager.recordsPerPage;

const allowedSortFields = [
  'name',
  'price',
  'stock',
  'description',
  'categoryName',
  'imageUrl',
  'imageLocalPath',
];

const sortBy: string = allowedSortFields.includes(pager.sortBy ?? '')
  ? pager.sortBy!
  : 'name';

const sortOrder: 'ASC' | 'DESC' =
  pager.sortOrder === 'DESC' ? 'DESC' : 'ASC';

const order: any = {};
order[sortBy] = sortOrder;

const [products, total] = await this.productRepository.findAndCount({
  order,
  skip,
  take: pager.recordsPerPage,
});


  response.result = {
  products: products,
  pagination: {
    totalRecords: total,
    totalPages: Math.ceil(total / pager.recordsPerPage),
    currentPage: pager.page,
    recordsPerPage: pager.recordsPerPage,
  },
};

  } catch (error) {
    response.isSuccess = false;
    response.message = error.message;
  }
  return response;
}




  async create(productDto: ProductDto): Promise<ResponseDto<ProductDto>> {
    const response = new ResponseDto<ProductDto>();
    try {
      const newProduct = this.productRepository.create(productDto);
      const savedProduct = await this.productRepository.save(newProduct);
      response.result = savedProduct;
    } catch (error) {
      response.isSuccess = false;
      response.message = error.message;
    }
    return response;
  }

  async update(id: number, productDto: ProductDto): Promise<ResponseDto<ProductDto>> {
  const response = new ResponseDto<ProductDto>();
  try {
    const product = await this.productRepository.findOneBy({ productId: id });
    if (!product) throw new NotFoundException('Producto no encontrado');

    // Si se proporciona nueva imagen y es distinta, eliminar la anterior
    if (
      productDto.imageLocalPath &&
      productDto.imageLocalPath !== product.imageLocalPath &&
      product.imageLocalPath &&
      fs.existsSync(product.imageLocalPath)
    ) {
      fs.unlinkSync(product.imageLocalPath);
    }

    // Actualizar campos
    const updatedProduct = Object.assign(product, productDto);
    const savedProduct = await this.productRepository.save(updatedProduct);
    response.result = savedProduct;
  } catch (error) {
    response.isSuccess = false;
    response.message = error.message;
  }
  return response;
}


 async delete(id: number): Promise<ResponseDto<null>> {
  const response = new ResponseDto<null>();
  try {
    const product = await this.productRepository.findOneBy({ productId: id });
    if (!product) throw new NotFoundException('Producto no encontrado');

    // Borrar imagen local si existe
    if (product.imageLocalPath && fs.existsSync(product.imageLocalPath)) {
      fs.unlinkSync(product.imageLocalPath);
    }

    await this.productRepository.delete(id);
    response.message = 'Producto eliminado correctamente';
  } catch (error) {
    response.isSuccess = false;
    response.message = error.message;
  }
  return response;
}


}
