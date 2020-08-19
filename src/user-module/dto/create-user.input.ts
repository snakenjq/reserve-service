import { InputType, Field } from '@nestjs/graphql';
import { RoleType } from 'common';

@InputType()
export class CreateUserInput {
  @Field(() => RoleType)
  role: RoleType;
}
