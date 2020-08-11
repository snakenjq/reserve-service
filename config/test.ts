import { EnvConfig } from './env.config';

export default {
  typeOrmConfig: {
    url:
      'postgresql://postgres:mysecretpassword@127.0.0.1/reverse-management-test',
    logging: true,
  },
  // graphConfig: {
  //   playground: false,
  // },
} as EnvConfig;
