import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { CheckEnum, RoleType } from 'common';
import { Account } from 'account-module';

@ObjectType()
@Entity()
@CheckEnum('user', 'role', RoleType)
export class User {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Field(() => RoleType)
  @Column()
  role: RoleType;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
