import {
  Injectable,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../model';
import { CreateUserInput } from '../dto';
import { AccountService } from 'account-module';
@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(account: any, input: CreateUserInput): Promise<User> {
    const userEntity: User = new User();
    userEntity.accountId = account.id;
    userEntity.role = input.role;
    try {
      return this.userRepository.save(userEntity);
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const found = this.userRepository.findOne(id);
      if (!found) {
        this.logger.error(`user not found!`);
        throw new NotFoundException(`user not found`);
      }
      return found;
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }
}
