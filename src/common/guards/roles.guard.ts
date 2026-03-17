import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  METADATA_KEY_ROLES,
  METADATA_KEY_PUBLIC,
} from '../constants/metadata.constants';
import { TeacherRole } from '../../modules/teacher/enums/teacher-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEY_PUBLIC,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      METADATA_KEY_ROLES,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    // SUPER_ADMIN bypasses all role restrictions
    if (user.role === TeacherRole.SUPER_ADMIN) return true;

    if (!requiredRoles || requiredRoles.length === 0) return true;

    return requiredRoles.includes(user.role);
  }
}
