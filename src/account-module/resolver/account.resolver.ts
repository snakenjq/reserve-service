import { ValidationPipe, UseFilters, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { AccountService } from '../service';
import { Account } from '../model';
import {
  CreateAccountInput,
  TokenOutput,
  UpdatePasswordInput,
  AccountOutput,
} from '../dto';
import { GetUser, GqlAuth } from '../decorator';
import { GraphqlExceptionFilter, RoleType } from '../../common';
import { GqlAuthGuard } from 'account-module/guard';

@Resolver()
@UseFilters(GraphqlExceptionFilter)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation(() => Account)
  async signUp(
    @Args('input', ValidationPipe) input: CreateAccountInput,
  ): Promise<Account> {
    return await this.accountService.signUp(input);
  }

  @Query(() => TokenOutput)
  async signIn(@Args('input') input: CreateAccountInput): Promise<TokenOutput> {
    return await this.accountService.signIn(input);
  }

  @Mutation(() => Account)
  @UseGuards(GqlAuthGuard)
  async updatePassword(
    @GetUser('graphql') user: Account,
    @Args('input') input: UpdatePasswordInput,
  ): Promise<Account> {
    await this.accountService.updatePassword(user, input);
    return this.accountService.findById(user.id);
  }

  @Mutation(() => Boolean)
  @GqlAuth(RoleType.ADMIN)
  async deleteAccountById(@Args('id') id: number): Promise<boolean> {
    return this.accountService.delete(id);
  }

  @Query(() => TokenOutput)
  @UseGuards(GqlAuthGuard)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<Object> {
    return await this.accountService.verifyRefreshToken(refreshToken);
  }

  @Query(() => AccountOutput)
  @UseGuards(GqlAuthGuard)
  async getAccount(@GetUser('graphql') user: Account): Promise<AccountOutput> {
    return await this.accountService.getById(user.id);
  }

  @Query(() => AccountOutput)
  @GqlAuth(RoleType.ADMIN, RoleType.EMPLOYEE)
  async getAccountById(@Args('id') id: number): Promise<AccountOutput> {
    return await this.accountService.getById(id);
  }
}
