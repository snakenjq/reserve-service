import { Controller, Post } from '@nestjs/common';

import { UserService } from '../service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('/test')
  // async test(): Promise<boolean> {
  //   this.userService.test();
  //   return true;
  // }
}
