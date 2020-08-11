import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { ReserveService } from '../service';

@Resolver()
export class ReserveResolver {
  private readonly logger = new Logger('ReserveResolver');
  constructor(private readonly reserveService: ReserveService) {}
}
