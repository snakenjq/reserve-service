import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import * as config from 'config';

import { UserModule } from 'user-module';
import { RestaurantModule } from 'restaurant-module';
import { AuthModule } from 'auth-module';
import { ReserveModule } from 'reserve-module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.get('typeOrmConfig')),
    GraphQLModule.forRoot(config.get('graphConfig')),
    AuthModule,
    UserModule,
    RestaurantModule,
    ReserveModule,
  ],
})
export class AppModule {}
