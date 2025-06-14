import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'F1lLX8SA9R2JDJKS2J8SDF8VA886SDF2s97DSs98SXE87s8sSD8S8DS=8SsdbbdROI2', // debe ser igual que en JwtModule
    });
  }

 async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, roles: payload.roles, username: payload.username, };
  }
}
