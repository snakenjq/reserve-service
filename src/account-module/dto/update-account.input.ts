import { PartialType, InputType } from '@nestjs/graphql';
import { CreateAccountInput } from '.';

@InputType()
export class UpdateAccountInput extends PartialType(CreateAccountInput) {}
