import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { User } from './User';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum TransactionCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
  SHOPPING = 'shopping',
  BILLS = 'bills',
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  OTHER = 'other'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsNotEmpty()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  amount!: number;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionCategory
  })
  @IsEnum(TransactionCategory)
  category!: TransactionCategory;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: true })
  @IsOptional()
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;
}
