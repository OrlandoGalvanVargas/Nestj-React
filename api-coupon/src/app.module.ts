// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { Coupon } from './coupon/entities/coupon.entity';
import { CouponModule } from './coupon/coupon.module';

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: 'localhost',
        port: 1433,
        username: 'sa',
        password: 'Darmixista5',
        database: 'Coupons',
        entities: [Coupon],
        synchronize: true,
        options: {
          encrypt: false,
        },
      }),
    }),
    CouponModule, // 👈 ya contiene controller y service
  ],
  controllers: [], // 👈 elimina ProductController
  providers: [
    JwtStrategy,
  ],
})
export class AppModule {}
