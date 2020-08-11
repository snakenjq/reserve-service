import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { UserService, User } from 'user-module';

@Resolver()
export class UserResolver {
  private readonly logger = new Logger('UserResolver');
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async test() {}
}
