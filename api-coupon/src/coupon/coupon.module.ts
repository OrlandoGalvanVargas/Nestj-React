// product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { JwtStrategy } from '../auth/jwt.strategy'; // ajusta ruta si es necesario
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // asegúrate que exista
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]),
  PassportModule,
 JwtModule.register({
      secret: 'F1lLX8SA9R2JDJKS2J8SDF8VA886SDF2s97DSs98SXE87s8sSD8S8DS=8SsdbbdROI2', 
      signOptions: { expiresIn: '7d' },
    }),],

  controllers: [CouponController],
  providers: [CouponService,JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [CouponService], 
})
export class CouponModule {}
