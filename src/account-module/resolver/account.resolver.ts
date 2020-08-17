import { ValidationPipe, Logger, Req, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { AccountService } from '../service';
import { Account } from '../model';
import { CreateAccountInput, TokenOutput } from '../dto';
import { AuthGuard } from '../guard';
import { GetUser } from '../decorator';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  async test(@GetUser('graphql') user): Promise<boolean> {
    console.log(user.userName);
    return true;
  }

  @Mutation(() => Account)
  async signUp(
    @Args('input', ValidationPipe) input: CreateAccountInput,
  ): Promise<Account> {
    return await this.accountService.signUp(input);
  }

  @Query(() => TokenOutput)
  async signIn(@Args('input') input: CreateAccountInput): Promise<Object> {
    return await this.accountService.signIn(input);
  }

  @Query(() => TokenOutput)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<Object> {
    return await this.accountService.verifyRefreshToken(refreshToken);
  }
}
