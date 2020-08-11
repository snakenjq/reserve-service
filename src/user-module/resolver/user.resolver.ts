import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { UserService } from '../service';
import { User } from '../model';

@Resolver()
export class UserResolver {
  private readonly logger = new Logger('UserResolver');
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async test() {}
}
