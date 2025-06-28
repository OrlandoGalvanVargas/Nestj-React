// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('F1lLX8SA9R2JDJKS2J8SDF8VA886SDF2s97DSs98SXE87s8sSD8S8DS=8SsdbbdROI2', "F1lLX8SA9R2JDJKS2J8SDF8VA886SDF2s97DSs98SXE87s8sSD8S8DS=8SsdbbdROI2"), // o una constante si no usas env
    });
  }

async validate(payload: any) {
  console.log('Payload recibido en Product:', payload); // ⚠️ Agrega esto

  return {
    id: payload.sub,
    email: payload.email,
    roles: Array.isArray(payload.roles) ? payload.roles : [payload.roles],
  };
}


}
