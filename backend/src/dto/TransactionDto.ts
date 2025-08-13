import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { TransactionType, TransactionCategory } from '../models/Transaction';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Max(999999.99, { message: 'Amount must be less than 1,000,000' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Type must be either income or expense' })
  type: TransactionType;

  @IsEnum(TransactionCategory, { message: 'Invalid category' })
  category: TransactionCategory;

  @IsDateString({}, { message: 'Please provide a valid date' })
  date: string;

  @IsOptional()
  notes?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Max(999999.99, { message: 'Amount must be less than 1,000,000' })
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'Type must be either income or expense' })
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionCategory, { message: 'Invalid category' })
  category?: TransactionCategory;

  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date' })
  date?: string;

  @IsOptional()
  notes?: string;
}
