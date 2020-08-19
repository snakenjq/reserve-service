import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { GqlAuthGuard, GqlRolesGuard } from '../guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
    UseGuards(GqlAuthGuard, GqlRolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  );
}
