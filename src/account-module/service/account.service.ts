import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';

import { Account, Token } from '../model';
import { CreateAccountInput, TokenOutput } from '../dto';
import { AuthPayload } from '../interface';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(input: CreateAccountInput): Promise<Account> {
    const entity: CreateAccountInput = input;
    const exists = await this.accountRepository.findOne({
      userName: entity.userName,
    });
    if (exists) {
      this.logger.error(`User name: "${entity.userName}" is already exists!`);
      throw new BadRequestException(
        `User name: "${entity.userName}" is already exists!`,
      );
    }
    entity.password = bcrypt.hashSync(entity.password, 5);
    const account: Account = await this.accountRepository.save(entity);
    delete account.password;
    return account;
  }

  async signIn(input: CreateAccountInput): Promise<TokenOutput> {
    const account = await this.findByName(input.userName);
    if (bcrypt.compareSync(input.password, account.password)) {
      const payload: AuthPayload = {
        id: account.id,
      };
      return await this.createToken(payload);
    } else {
      this.logger.error(`Wrong password!`);
      throw new BadRequestException(`Wrong password!`);
    }
  }

  async findByName(userName: string): Promise<Account> {
    const user = await this.accountRepository.findOne({ userName: userName });
    if (!user) {
      this.logger.error(`User name: "${userName}" is not found!`);
      throw new NotFoundException(`User name: "${userName}" is not found!`);
    }
    return user;
  }

  async findById(id: number): Promise<Account> {
    const account = await this.accountRepository.findOne(id);
    if (!account) {
      this.logger.error(`account not found!`);
      throw new NotFoundException(`account not found`);
    }
    delete account.password;
    return account;
  }

  async createToken(payload: AuthPayload): Promise<TokenOutput> {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: 3600 * 10,
    });
    const tokenEntity: Token = new Token();
    tokenEntity.accountId = payload.id;
    tokenEntity.accessToken = accessToken;
    tokenEntity.refreshToken = refreshToken;
    await this.tokenRepository.save(tokenEntity);
    return tokenEntity;
  }

  async verifyAccessToken(accessToken: string): Promise<Account> {
    try {
      await this.jwtService.verifyAsync(accessToken);
      const payload = this.jwtService.decode(accessToken);
      if (await this.checkToken(payload['id'])) {
        const account = await this.findById(payload['id']);
        delete account.password;
        return account;
      }
    } catch (error) {
      switch (error.message) {
        case 'jwt expired':
          this.logger.error('accessToken expired');
          throw new UnauthorizedException('accessToken expired', error);
        case 'signature verify failed':
          this.logger.error('accessToken signature verify failed');
          throw new UnauthorizedException(
            'accessToken signature verify failed',
            error,
          );
        case 'accessToken not found':
          this.logger.error('accessToken not found');
          throw new NotFoundException('accessToken not found');
        case 'account not found':
          this.logger.error('account not found');
          throw new NotFoundException('account not found');
        default:
          throw new Error(error.message);
      }
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<TokenOutput> {
    try {
      await this.jwtService.verifyAsync(refreshToken);
      const payload = this.jwtService.decode(refreshToken);
      const refreshPayload: AuthPayload = {
        id: payload['id'],
      };
      if (await this.checkToken(refreshPayload.id)) {
        return await this.createToken(refreshPayload);
      }
    } catch (error) {
      switch (error.message) {
        case 'jwt expired':
          this.logger.error('refreshToken expired');
          throw new UnauthorizedException('refreshToken expired', error);
        case 'signature verify failed':
          this.logger.error('refreshToken signature verify failed');
          throw new UnauthorizedException(
            'refreshToken signature verify failed',
            error,
          );
        case 'refreshToken not found':
          this.logger.error('refreshToken not found');
          throw new NotFoundException('refreshToken not found');
        case 'account not found':
          this.logger.error('account not found');
          throw new NotFoundException('account not found');
        default:
          throw new Error(error.message);
      }
    }
  }

  async checkToken(id: number): Promise<boolean> {
    const token = await this.tokenRepository.findOne(id);
    if (!token) {
      this.logger.error(`accessToken not found!`);
      throw new NotFoundException('accessToken not found');
    }
    return true;
  }

  async checkExpireTokens(): Promise<void> {
    const tokens = await this.tokenRepository.find();
    tokens.map(async token => {
      try {
        await this.jwtService.verifyAsync(token.refreshToken);
      } catch (error) {
        if (error.message == 'jwt expired') {
          this.logger.verbose('delete expired refreshToken');
          await this.deleteToken(token.accountId);
        }
      }
    });
  }

  async deleteToken(id: number): Promise<boolean> {
    const result = await this.tokenRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Not found the token with ID: "${id}".`);
    }
    return true;
  }

  @Cron('00 00 * * * *')
  async handleCron() {
    this.logger.verbose(`schedule request start at ${new Date().toString()}`);
    await this.checkExpireTokens();
  }
}
