import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { AccountService } from '../service';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  constructor(private readonly accountService: AccountService) {}

  async use(req: Request, res: Response, next: Function) {
    const accessToken = req.headers.authorization;
    if (accessToken) {
      const user = await this.accountService.verifyAccessToken(accessToken);
      req['user'] = user;
    }
    next();
  }
}

// import { Request, Response } from 'express';

// export const globalMiddleWare = (
//   req: Request,
//   res: Response,
//   next: Function,
// ) => {
//   console.log(`Request...`, req);
//   next();
// };
