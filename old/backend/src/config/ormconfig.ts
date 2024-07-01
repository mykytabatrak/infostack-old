import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { env } from '../env';

const getDbConfig = (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    migrationsRun: env.db.migrationsRun,
    migrations: [env.db.migrationsDir],
    entities: [env.db.enititiesDir],
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    ssl: true,
    url: 'postgres://infostack_old_postgresql_user:ysEeU7Fuj5TPLikqAyBC2d7csfoq9G1p@dpg-cl6e11iuuipc73cbi3r0-a.frankfurt-postgres.render.com/infostack_old_postgresql',
    username: env.db.username,
    password: env.db.password,
    database: env.db.name,
  };
};

export default getDbConfig();
