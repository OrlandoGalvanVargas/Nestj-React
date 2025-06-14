import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/users/user.module';
import { User } from 'src/users/dto/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Darmixista5',
      database: 'Auth_Centralized',
      entities: [User],
      synchronize: true, // solo para desarrollo
      options: {
        encrypt: false, // depende de tu configuración SQL Server
      },
    }),
AuthModule,UserModule,
  ],
})
export class AppModule {}
