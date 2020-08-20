import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  GqlAuthGuard,
  GqlRolesGuard,
  RestfulAuthGuard,
  RestfulRolesGuard,
} from '../guard';
import { RoleType } from 'common';

export function GqlAuth(...roles: RoleType[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GqlAuthGuard, GqlRolesGuard),
  );
}

export function RestfulAuth(...roles: RoleType[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RestfulAuthGuard, RestfulRolesGuard),
  );
}
