import { InputType, Field } from '@nestjs/graphql';
import { MinLength, MaxLength, IsString } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword: string;
}
