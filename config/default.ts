import { EnvConfig } from './env.config';
import { join } from 'path';

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
