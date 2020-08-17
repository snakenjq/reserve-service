import {
  Entity,
  PrimaryColumn,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { Account } from './account.model';

@ObjectType()
@Entity()
export class Token {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Field()
  @Column()
  accessToken: string;

  @Field()
  @Column()
  refreshToken: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
