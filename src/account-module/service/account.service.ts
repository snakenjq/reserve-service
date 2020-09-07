import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Account } from '../model';
import { CreateAccountInput, TokenOutput } from '../dto';
import { AuthPayload } from '../interface';
import { CacheService } from './redis.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async signUp(input: CreateAccountInput): Promise<Account> {
    const entity: CreateAccountInput = input;
    try {
      const exists = await this.accountRepository.findOne({
        userName: entity.userName,
      });
      if (exists) {
        this.logger.error(`User name: "${entity.userName}" is already exists!`);
        throw new ForbiddenException(
          `User name: "${entity.userName}" is already exists!`,
        );
      }
      entity.password = bcrypt.hashSync(entity.password, 5);
      const account: Account = await this.accountRepository.save(entity);
      delete account.password;
      return account;
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }

  async signIn(input: CreateAccountInput): Promise<TokenOutput> {
    try {
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
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }

  async findByName(userName: string): Promise<Account> {
    try {
      const user = await this.accountRepository.findOne({ userName: userName });
      if (!user) {
        this.logger.error(`User name: "${userName}" is not found!`);
        throw new NotFoundException(`User name: "${userName}" is not found!`);
      }
      return user;
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }

  async findById(id: number): Promise<Account> {
    try {
      const account = await this.accountRepository.findOne(id);
      if (!account) {
        this.logger.error(`account not found!`);
        throw new NotFoundException(`account not found`);
      }
      delete account.password;
      return account;
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }

  async createToken(payload: AuthPayload): Promise<TokenOutput> {
    try {
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: 3600 * 10,
      });
      const token: TokenOutput = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      this.cacheService.set(payload.id.toString(), token, 3600 * 10);
      return token;
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }

  async verifyAccessToken(accessToken: string): Promise<Account> {
    try {
      await this.jwtService.verifyAsync(accessToken);
      const payload: AuthPayload = this.jwtService.decode(
        accessToken,
      ) as AuthPayload;
      if (await this.checkToken(payload.id)) {
        const account = await this.findById(payload.id);
        delete account.password;
        return account;
      }
    } catch (error) {
      this.handleJwtError(error, 'accessToken');
      throw HttpException.createBody(error);
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<TokenOutput> {
    try {
      await this.jwtService.verifyAsync(refreshToken);
      const payload: AuthPayload = this.jwtService.decode(
        refreshToken,
      ) as AuthPayload;
      const refreshPayload: AuthPayload = {
        id: payload.id,
      };
      if (await this.checkToken(refreshPayload.id)) {
        return await this.createToken(refreshPayload);
      }
    } catch (error) {
      this.handleJwtError(error, 'refreshToken');
      throw HttpException.createBody(error);
    }
  }

  async checkToken(id: number): Promise<boolean> {
    try {
      const token = await this.cacheService.get(id.toString());
      if (!token) {
        this.logger.error(`Token not found!`);
        throw new NotFoundException('Token not found');
      }
      return true;
    } catch (error) {
      throw HttpException.createBody(error);
    }
  }

  // async checkExpireTokens(): Promise<void> {
  //   try {
  //     const tokens = await this.tokenRepository.find();
  //     tokens.map(async token => {
  //       try {
  //         await this.jwtService.verifyAsync(token.refreshToken);
  //       } catch (error) {
  //         if (error.message == 'jwt expired') {
  //           this.logger.verbose('delete expired refreshToken');
  //           await this.deleteToken(token.accountId);
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     throw HttpException.createBody(error);
  //   }
  // }

  // async deleteToken(id: number): Promise<boolean> {
  //   try {
  //     const result = await this.tokenRepository.delete(id);
  //     if (result.affected === 0) {
  //       throw new NotFoundException(`Not found the token with ID: "${id}".`);
  //     }
  //     return true;
  //   } catch (error) {
  //     throw HttpException.createBody(error);
  //   }
  // }

  // @Cron('00 00 * * * *')
  // async handleCron() {
  //   this.logger.verbose(`schedule request start at ${new Date().toString()}`);
  //   await this.checkExpireTokens();
  // }

  private readonly handleJwtError = (error: any, tokenType: string) => {
    switch (error.message) {
      case 'jwt expired':
        this.logger.error(`${tokenType} expired`);
        throw new UnauthorizedException(`${tokenType} expired`);
      case 'invalid signature':
        this.logger.error(`${tokenType} signature verify failed`);
        throw new UnauthorizedException(`${tokenType} signature verify failed`);
    }
  };
}
