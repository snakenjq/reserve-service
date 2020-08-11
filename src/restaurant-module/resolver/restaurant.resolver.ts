import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { RestaurantService } from 'restaurant-module';

@Resolver()
export class RestaurantResolver {
  private readonly logger = new Logger('RestaurantResolver');
  constructor(private readonly restaurantService: RestaurantService) {}
}
