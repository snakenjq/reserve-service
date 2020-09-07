import { GqlModuleOptions } from '@nestjs/graphql';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface EnvConfig {
  app: {
    port: number;
  };
  jwtConfig: {
    secret: string;
    signOptions: {
      expiresIn: number;
    };
  };
  redisConfig: {
    host: string;
    port: number;
    db: number;
    password: string;
    keyPrefix: string;
    onClientReady: () => {};
  };
  typeOrmConfig: TypeOrmModuleOptions;
  graphConfig: GqlModuleOptions;
}
