import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'user-module';

@ObjectType()
export class AccountOutput {
  @Field()
  id: number;

  @Field()
  userName: string;

  @Field(() => User)
  user?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
