import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/users/roles.enum';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (roles.length) {
      const request = context.switchToHttp().getRequest();
      const role = request.user.sub[1];
      const roleId = RoleEnum[role as keyof typeof RoleEnum];
      return roles.includes(roleId);
    }
    return false;
  }
}
