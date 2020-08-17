import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (data === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user;
    } else {
      const request = context.switchToHttp().getRequest();
      return request.user;
    }
  },
);
