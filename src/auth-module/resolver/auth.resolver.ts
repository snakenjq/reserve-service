import { Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { AuthService } from '../service';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger('AuthResolver');
  constructor(private readonly authService: AuthService) {}
}
