import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleType } from 'common';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const user = req.user;
    return mathRoles(roles, user.role);
  }
}

@Injectable()
export class RestfulRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    const ctx = context.switchToHttp();
    const req = ctx.getResponse().req;
    const user = req.user;
    return mathRoles(roles, user.role);
  }
}

const mathRoles = (roles: string[], role: RoleType): boolean => {
  if (!roles.includes(role)) {
    throw new ForbiddenException('Insufficient authority of account');
  }
  return true;
};
