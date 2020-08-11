import { registerEnumType } from '@nestjs/graphql';

export enum RoleType {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER',
}
registerEnumType(RoleType, {
  name: 'RoleType',
});
