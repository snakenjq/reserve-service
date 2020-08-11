import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { RestaurantService } from '../service';
import { Restaurant } from '../model';

@Resolver()
export class RestaurantResolver {
  private readonly logger = new Logger('RestaurantResolver');
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => Restaurant)
  async getRestaurants() {
    return true;
  }
}
