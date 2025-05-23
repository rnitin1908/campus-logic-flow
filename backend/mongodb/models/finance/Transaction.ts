import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type TransactionType = 'payment' | 'refund' | 'salary' | 'purchase' | 'donation' | 'investment' | 'transfer' | 'adjustment' | 'fine' | 'other';
export type TransactionStatusType = 'pending' | 'completed' | 'failed' | 'cancelled' | 'on_hold' | 'reversed';

export interface ITransaction extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  transaction_id: string;
  reference_number?: string;
  transaction_type: TransactionType;
  
  // Amount details
  amount: number;
  currency: string;
  tax_amount?: number;
  discount_amount?: number;
  fee_amount?: number;
  total_amount: number;
  
  // Transaction details
  transaction_date: Date;
  description: string;
  notes?: string;
  status: TransactionStatusType;
  
  // Related entities
  payment_id?: mongoose.Types.ObjectId | string;
  student_id?: mongoose.Types.ObjectId | string;
  parent_id?: mongoose.Types.ObjectId | string;
  employee_id?: mongoose.Types.ObjectId | string;
  supplier_id?: mongoose.Types.ObjectId | string;
  
  // Accounting details
  account_code?: string;
  cost_center?: string;
  fiscal_year: string;
  accounting_period?: string;
  is_reconciled: boolean;
  reconciled_date?: Date;
  reconciled_by?: mongoose.Types.ObjectId | string;
  
  // Payment method details
  payment_method: string;
  payment_details?: {
    // For cash
    cash_received?: number;
    cash_returned?: number;
    
    // For check/bank transfer
    bank_name?: string;
    check_number?: string;
    account_number?: string;
    ifsc_code?: string;
    utr_number?: string;
    
    // For cards
    card_type?: string;
    last_four_digits?: string;
    authorization_code?: string;
    
    // For online payments
    gateway?: string;
    gateway_transaction_id?: string;
    gateway_fee?: number;
    gateway_response?: string;
  };
  
  // Categorization
  category?: string;
  sub_category?: string;
  tags?: string[];
  academic_year?: string;
  term_id?: mongoose.Types.ObjectId | string;
  
  // For double-entry accounting
  debit_account?: string;
  credit_account?: string;
  
  // For refunds or adjustments
  related_transaction_id?: mongoose.Types.ObjectId | string;
  adjustment_reason?: string;
  
  // Document references
  invoice_number?: string;
  receipt_number?: string;
  document_url?: string;
  
  // Audit information
  processed_by: mongoose.Types.ObjectId | string;
  verified_by?: mongoose.Types.ObjectId | string;
  updated_by?: mongoose.Types.ObjectId | string;
}

const transactionSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  transaction_id: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  reference_number: {
    type: String,
    trim: true,
    index: true
  },
  transaction_type: {
    type: String,
    enum: ['payment', 'refund', 'salary', 'purchase', 'donation', 'investment', 'transfer', 'adjustment', 'fine', 'other'],
    required: true,
    index: true
  },
  
  // Amount details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  tax_amount: {
    type: Number
  },
  discount_amount: {
    type: Number
  },
  fee_amount: {
    type: Number
  },
  total_amount: {
    type: Number,
    required: true
  },
  
  // Transaction details
  transaction_date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'on_hold', 'reversed'],
    required: true,
    default: 'pending',
    index: true
  },
  
  // Related entities
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    index: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    index: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  
  // Accounting details
  account_code: {
    type: String,
    trim: true
  },
  cost_center: {
    type: String,
    trim: true
  },
  fiscal_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  accounting_period: {
    type: String,
    trim: true,
    index: true
  },
  is_reconciled: {
    type: Boolean,
    default: false,
    index: true
  },
  reconciled_date: {
    type: Date
  },
  reconciled_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Payment method details
  payment_method: {
    type: String,
    required: true,
    index: true
  },
  payment_details: {
    // For cash
    cash_received: {
      type: Number
    },
    cash_returned: {
      type: Number
    },
    
    // For check/bank transfer
    bank_name: {
      type: String,
      trim: true
    },
    check_number: {
      type: String,
      trim: true
    },
    account_number: {
      type: String,
      trim: true
    },
    ifsc_code: {
      type: String,
      trim: true
    },
    utr_number: {
      type: String,
      trim: true
    },
    
    // For cards
    card_type: {
      type: String,
      trim: true
    },
    last_four_digits: {
      type: String,
      trim: true
    },
    authorization_code: {
      type: String,
      trim: true
    },
    
    // For online payments
    gateway: {
      type: String,
      trim: true
    },
    gateway_transaction_id: {
      type: String,
      trim: true
    },
    gateway_fee: {
      type: Number
    },
    gateway_response: {
      type: String
    }
  },
  
  // Categorization
  category: {
    type: String,
    trim: true,
    index: true
  },
  sub_category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  academic_year: {
    type: String,
    trim: true,
    index: true
  },
  term_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicTerm'
  },
  
  // For double-entry accounting
  debit_account: {
    type: String,
    trim: true
  },
  credit_account: {
    type: String,
    trim: true
  },
  
  // For refunds or adjustments
  related_transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  adjustment_reason: {
    type: String
  },
  
  // Document references
  invoice_number: {
    type: String,
    trim: true,
    index: true
  },
  receipt_number: {
    type: String,
    trim: true,
    index: true
  },
  document_url: {
    type: String
  },
  
  // Audit information
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Apply standard indexes
applyStandardIndexes(transactionSchema);

// Additional compound indexes
transactionSchema.index({ tenant_id: 1, school_id: 1, transaction_date: 1 });
transactionSchema.index({ tenant_id: 1, transaction_type: 1, status: 1 });
transactionSchema.index({ tenant_id: 1, fiscal_year: 1, accounting_period: 1 });
transactionSchema.index({ tenant_id: 1, student_id: 1, transaction_date: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
