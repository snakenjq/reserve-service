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
  typeOrmConfig: TypeOrmModuleOptions;
  graphConfig: GqlModuleOptions;
}
