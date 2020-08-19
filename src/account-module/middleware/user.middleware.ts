import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { AccountService } from '../service';
import { UserService } from 'user-module';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: Function) {
    const accessToken = req.headers.authorization;
    if (accessToken) {
      const account = await this.accountService.verifyAccessToken(accessToken);
      const user = await this.userService.findById(account.id);
      if (user) {
        account['role'] = user.role;
      }
      req['user'] = account;
    }
    next();
  }
}
