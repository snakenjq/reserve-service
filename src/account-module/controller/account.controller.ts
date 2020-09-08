import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Logger,
  UseFilters,
  UseGuards,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';

import { AccountService } from '../service';
import { CreateAccountInput, TokenOutput, UpdatePasswordInput } from '../dto';
import { Account } from '../model';
import { RestfulExceptionFilter, RoleType } from '../../common';
import { GetUser } from 'account-module';
import { RestfulAuth } from 'account-module/decorator';
import { RestfulAuthGuard } from 'account-module/guard';

@Controller('account')
@UseFilters(RestfulExceptionFilter)
export class AccountController {
  private readonly logger = new Logger('AccountController');
  constructor(private readonly accountService: AccountService) {}

  @Post('/test')
  @RestfulAuth(RoleType.ADMIN)
  async test(@GetUser() user): Promise<boolean> {
    console.log('>>>AccountController test ', user);
    return true;
  }

  @Post('/signUp')
  async signUp(
    @Body(ValidationPipe) input: CreateAccountInput,
  ): Promise<Account> {
    return await this.accountService.signUp(input);
  }

  @Post('/signIn')
  async signIn(
    @Body(ValidationPipe) input: CreateAccountInput,
  ): Promise<TokenOutput> {
    return await this.accountService.signIn(input);
  }

  @Patch()
  @UseGuards(RestfulAuthGuard)
  async updatePassword(
    @GetUser() user,
    @Body(ValidationPipe) input: UpdatePasswordInput,
  ): Promise<Account> {
    await this.accountService.updatePassword(user, input);
    return this.accountService.findById(user.id);
  }

  @Delete('/:id')
  @RestfulAuth(RoleType.ADMIN)
  async deleteAccountByID(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.accountService.delete(id);
  }

  @Get('/:refreshToken')
  @UseGuards(RestfulAuthGuard)
  async refreshToken(
    @Param('refreshToken') refreshToken: string,
  ): Promise<Object> {
    return await this.accountService.verifyRefreshToken(refreshToken);
  }
}
