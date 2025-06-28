import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartHeader } from './shopping-cart/entities/cart-header.entity';
import { CartDetails } from './shopping-cart/entities/cart-details.entity';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '1433')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [CartHeader, CartDetails],
        synchronize: true,
        options: {
          encrypt: false,
        },
      }),
    }),
    ShoppingCartModule,
  ],
})
export class AppModule {}
