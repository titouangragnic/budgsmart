import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import { Transaction } from './models/Transaction';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'budgsmart',
  synchronize: true, // Always false for production safety
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Transaction],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
