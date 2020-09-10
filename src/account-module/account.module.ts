import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import {
  Account,
  AccountService,
  AccountResolver,
  AccountController,
  CacheService,
} from '.';
import { UserModule } from 'user-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register(config.get('jwtConfig')),
    UserModule,
  ],
  providers: [AccountService, AccountResolver, CacheService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
