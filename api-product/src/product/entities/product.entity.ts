// src/product/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Productos')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  name: string;

  @Column('float')
  price: number;

 @Column({ default: 0 }) // 👈 Agrega esta línea
  stock: number;
  
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  categoryName: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  imageLocalPath: string;
}
