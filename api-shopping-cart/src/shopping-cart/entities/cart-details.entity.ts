// src/shopping-cart/entities/cart-details.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CartHeader } from './cart-header.entity';

@Entity('CartDetails')
export class CartDetails {
  @PrimaryGeneratedColumn()
  cartDetailsId: number;

  @Column()
  cartHeaderId: number;

  @ManyToOne(() => CartHeader, (cartHeader) => cartHeader.cartHeaderId)
  @JoinColumn({ name: 'cartHeaderId' })
  cartHeader: CartHeader;

  @Column()
  productId: number;

  // No se persiste, se trae de otro microservicio
  productDto?: any;

  @Column()
  count: number;
}
