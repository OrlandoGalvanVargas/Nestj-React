// src/coupon/entities/coupon.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Cupones')
export class Coupon {
  @PrimaryGeneratedColumn()
  couponId: number;

  @Column({ unique: true })
  couponCode: string;

  @Column('float')
  discountAmount: number;

  @Column()
  minAmount: number;

  @Column()
  lastUpdated: Date;

  @Column()
  amountType: string;

  @Column()
  limitUser: number;

  @Column()
  dateInit: Date;

  @Column()
  dateEnd: Date;

  @Column()
  category: string;

  @Column()
  stateCoupon: boolean;
}
