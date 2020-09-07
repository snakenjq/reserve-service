import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import * as Redis from 'ioredis';

@Injectable()
export class CacheService {
  public client: Redis.Redis;
  constructor(private redisService: RedisService) {
    this.getClient();
  }

  async getClient() {
    this.client = this.redisService.getClient();
  }

  async set(key: string, value: any, seconds?: number) {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.getClient();
    }
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }

  async get(key: string) {
    if (!this.client) {
      await this.getClient();
    }
    const data = await this.client.get(key);
    if (!data) return;
    return JSON.parse(data);
  }
}
