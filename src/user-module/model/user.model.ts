import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { RoleType, CheckEnum } from 'common';

@ObjectType()
@Entity()
@CheckEnum('user', 'role', RoleType)
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => RoleType)
  @Column()
  role: RoleType;
}