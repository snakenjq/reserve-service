import { EnvConfig } from './env.config';
import { join } from 'path';
import * as redisStore from 'cache-manager-redis-store';

const DB_TYPE = 'postgres';
const GRAPH_SCHEMA_PATH = 'graphql/schema.gql';
const TYPE_ORM_MODELS_PATH = 'dist/src/**/*.model.js';

export default {
  app: {
    port: 3000,
  },
  jwtConfig: {
    secret: 'topSecret51',
    signOptions: {
      expiresIn: 3600,
    },
  },
  redisConfig: {
    host: 'localhost',
    port: 6379,
    db: 0,
    password: '',
    keyPrefix: 'token_',
    onClientReady: client => {
      client.on('error', err => {});
    },
  },
  typeOrmConfig: {
    type: DB_TYPE,
    entities: [TYPE_ORM_MODELS_PATH],
    synchronize: true,
    logging: false,
  },
  graphConfig: {
    playground: true,
    debug: false,
    autoSchemaFile: join(process.cwd(), GRAPH_SCHEMA_PATH),
    tracing: false,
    context: ({ req, res }) => ({ req, res }),
  },
} as EnvConfig;
