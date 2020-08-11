import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  RestaurantController,
  RestaurantService,
  Restaurant,
  RestaurantResolver,
} from '.';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantResolver],
})
export class RestaurantModule {}
