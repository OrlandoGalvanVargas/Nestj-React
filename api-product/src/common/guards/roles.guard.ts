import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // si no hay roles requeridos, permitir
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
console.log('User en guard:', user);

    if (!user || !user.roles) {
      throw new ForbiddenException('No roles found for user');
    }

    const hasRole = requiredRoles.some(role => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('User does not have required roles');
    }

    return true;
  }
}
