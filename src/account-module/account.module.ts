import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import {
  Token,
  Account,
  AccountService,
  AccountResolver,
  AccountController,
} from '.';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    TypeOrmModule.forFeature([Token]),
    JwtModule.register(config.get('jwtConfig')),
  ],
  providers: [AccountService, AccountResolver],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
