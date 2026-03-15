import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { METADATA_KEY_ROLES, METADATA_KEY_PUBLIC } from '../constants/metadata.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(METADATA_KEY_PUBLIC, context.getHandler());
    if (isPublic) return true;

    const requiredRoles = this.reflector.get<string[]>(METADATA_KEY_ROLES, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
