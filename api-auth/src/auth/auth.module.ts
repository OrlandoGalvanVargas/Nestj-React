import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from 'src/users/dto/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserController } from 'src/users/controllers/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'F1lLX8SA9R2JDJKS2J8SDF8VA886SDF2s97DSs98SXE87s8sSD8S8DS=8SsdbbdROI2',  // Mejor usar variable de entorno
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, UserController],
  exports: [AuthService],
})
export class AuthModule {}
