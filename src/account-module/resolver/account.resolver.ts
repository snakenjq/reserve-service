import { ValidationPipe, Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { AccountService } from '../service';
import { Account } from '../model';
import { CreateAccountInput, TokenOutput } from '../dto';
import { GetUser, GqlAuth } from '../decorator';
import { GraphqlExceptionFilter, RoleType } from '../../common';
import { GqlAuthGuard } from 'account-module/guard';

@Resolver()
@UseFilters(GraphqlExceptionFilter)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => Boolean)
  @GqlAuth(RoleType.ADMIN)
  async test(@GetUser('graphql') user): Promise<boolean> {
    console.log(user);
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
  @UseGuards(GqlAuthGuard)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<Object> {
    return await this.accountService.verifyRefreshToken(refreshToken);
  }
}
