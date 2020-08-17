import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('AuthGuard');
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    console.log('>>>>>Req:', req);
    const user = req.user ? req.user : null;
    if (!user) {
      this.logger.error('AuthGuard can not find user');
      return false;
    }
    return true;
  }
}
