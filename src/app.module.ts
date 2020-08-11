import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import * as config from 'config';

import { UserModule } from './user-module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.get('typeOrmConfig')),
    GraphQLModule.forRoot(config.get('graphConfig')),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
