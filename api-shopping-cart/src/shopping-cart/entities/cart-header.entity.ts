// src/shopping-cart/entities/cart-header.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('CartHeader')
export class CartHeader {
  @PrimaryGeneratedColumn()
  cartHeaderId: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  couponCode?: string;

  @Column({ type: 'float', nullable: true })
  discount?: number;

  @Column({ type: 'float', nullable: true })
  cartTotal?: number;
}
