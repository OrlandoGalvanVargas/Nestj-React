// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from './product/entities/product.entity';
import { ProductController } from './product/product.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

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
        database: 'Products',
        entities: [Product],
        synchronize: false,
        options: {
          encrypt: false,
        },
      }),
    }),
    ProductModule, // 👈 ya contiene controller y service
  ],
  controllers: [], // 👈 elimina ProductController
  providers: [
    JwtStrategy,
  ],
})
export class AppModule {}
