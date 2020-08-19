import { PartialType, InputType } from '@nestjs/graphql';
import { CreateUserInput } from '.';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
