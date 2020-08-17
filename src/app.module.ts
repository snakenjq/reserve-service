import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import * as config from 'config';

import { AccountModule, GlobalMiddleware } from 'account-module';
import { UserModule } from 'user-module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.get('typeOrmConfig')),
    GraphQLModule.forRoot(config.get('graphConfig')),
    ScheduleModule.forRoot(),
    AccountModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GlobalMiddleware)
      .forRoutes({ path: 'graphql', method: RequestMethod.POST });
  }
}
