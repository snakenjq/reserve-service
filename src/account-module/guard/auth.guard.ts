import {
  CanActivate,
  ExecutionContext,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class GqlAuthGuard implements CanActivate {
  private readonly logger = new Logger('GqlAuthGuard');
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const user = req.user ? req.user : null;
    if (!user) {
      this.logger.error('GqlAuthGuard can not find user');
      throw new NotFoundException('GqlAuthGuard can not find user');
    }
    return true;
  }
}

export class RestfulAuthGuard implements CanActivate {
  private readonly logger = new Logger('RestfulAuthGuard');
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const req = ctx.getResponse().req;
    const user = req.user ? req.user : null;
    if (!user) {
      this.logger.error('RestfulAuthGuard can not find user');
      throw new NotFoundException('RestfulAuthGuard can not find user');
    }
    return true;
  }
}
