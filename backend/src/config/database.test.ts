import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  username: process.env.TEST_DB_USERNAME || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'password',
  database: process.env.TEST_DB_DATABASE || 'budgsmart_test',
  synchronize: true,
  logging: false,
  entities: [User, Transaction],
  dropSchema: true, // Reset database for each test run
});
