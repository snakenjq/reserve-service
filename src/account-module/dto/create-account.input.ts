import { InputType, Field } from '@nestjs/graphql';
import { MinLength, MaxLength, IsString } from 'class-validator';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
