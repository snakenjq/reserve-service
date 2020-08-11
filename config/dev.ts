import { EnvConfig } from './env.config';

export default {
  typeOrmConfig: {
    url: 'postgresql://postgres:mysecretpassword@127.0.0.1/reserve-management',
    logging: true,
  },
  graphConfig: {
    playground: true,
    debug: true,
    tracing: true,
  },
} as EnvConfig;
