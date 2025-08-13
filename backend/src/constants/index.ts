export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PASSWORD_LENGTH: 6,
  MAX_TRANSACTION_AMOUNT: 999999.99,
  MIN_TRANSACTION_AMOUNT: 0.01,
  JWT_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 12
} as const;

export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_REQUIRED: 'Access token is required',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  
  // Validation errors
  VALIDATION_FAILED: 'Validation failed',
  INVALID_EMAIL: 'Please provide a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${API_CONFIG.MIN_PASSWORD_LENGTH} characters long`,
  
  // Transaction errors
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  INVALID_AMOUNT: `Amount must be between ${API_CONFIG.MIN_TRANSACTION_AMOUNT} and ${API_CONFIG.MAX_TRANSACTION_AMOUNT}`,
  
  // Server errors
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database connection error'
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully'
} as const;

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    'salary',
    'freelance',
    'investment',
    'other'
  ],
  EXPENSE: [
    'food',
    'transport',
    'entertainment',
    'health',
    'shopping',
    'bills',
    'other'
  ]
} as const;
