import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserService } from '../service';
import { User } from '../model';

import { CreateUserInput } from '../dto';
import { GqlAuthGuard } from 'account-module/guard';
import { GetUser } from 'account-module/decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async createUser(
    @GetUser('graphql') user,
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(user, input);
  }
}
