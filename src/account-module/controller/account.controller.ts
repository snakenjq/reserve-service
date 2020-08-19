import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Logger,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { AccountService } from '../service';
import { CreateAccountInput } from '../dto';
import { Account } from '../model';
import { RestfulExceptionFilter } from '../../common';
import { RestfulAuthGuard, GetUser } from 'account-module';

@Controller('account')
@UseFilters(RestfulExceptionFilter)
export class AccountController {
  private readonly logger = new Logger('AccountController');
  constructor(private readonly accountService: AccountService) {}

  @Post('/test')
  @UseGuards(RestfulAuthGuard)
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
}
