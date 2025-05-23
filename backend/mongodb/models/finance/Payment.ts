import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type PaymentMethodType = 'cash' | 'check' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'online_payment' | 'upi' | 'wallet' | 'other';
export type PaymentStatusType = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled';

export interface IPayment extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  student_id: mongoose.Types.ObjectId | string;
  parent_id?: mongoose.Types.ObjectId | string;
  class_id?: mongoose.Types.ObjectId | string;
  payment_number: string;
  
  // Fee reference
  fees: {
    fee_id: mongoose.Types.ObjectId | string;
    fee_name: string;
    fee_type: string;
    installment_number?: number;
    amount_due: number;
    amount_paid: number;
    balance: number;
    discount_applied?: number;
    late_fee_applied?: number;
  }[];
  
  // Payment details
  payment_date: Date;
  academic_year: string;
  term_id?: mongoose.Types.ObjectId | string;
  amount: number;
  discount_amount: number;
  late_fee: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  payment_method: PaymentMethodType;
  status: PaymentStatusType;
  
  // Tracking info
  payment_notes?: string;
  remarks?: string;
  payment_for?: string;
  payment_purpose?: 'regular_fee' | 'admission_fee' | 'fine' | 'other';
  
  // Payment info
  transaction_id?: string;
  transaction_reference?: string;
  receipt_number: string;
  payment_proof_url?: string;
  
  // Bank details (if applicable)
  bank_details?: {
    bank_name?: string;
    account_number?: string;
    check_number?: string;
    branch_name?: string;
    ifsc_code?: string;
    utr_number?: string;
  };
  
  // Card details (if applicable)
  card_details?: {
    card_type?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
    last_four_digits?: string;
    card_holder_name?: string;
    authorization_code?: string;
  };
  
  // Online payment gateway details
  online_payment_details?: {
    gateway: string;
    payment_id: string;
    order_id?: string;
    gateway_fee?: number;
    gateway_tax?: number;
    gateway_response?: string;
  };
  
  // Refund details
  refund?: {
    amount: number;
    date: Date;
    reason: string;
    processed_by: mongoose.Types.ObjectId | string;
    transaction_id?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
  };
  
  // Receipt
  receipt_generated: boolean;
  receipt_url?: string;
  receipt_generated_at?: Date;
  
  // Additional
  is_recurring: boolean;
  recurring_details?: {
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'custom';
    next_payment_date: Date;
    end_date?: Date;
    payment_count?: number;
    remaining_payments?: number;
    cancellation_reason?: string;
  };
  
  // For audit
  processed_by: mongoose.Types.ObjectId | string;
  approved_by?: mongoose.Types.ObjectId | string;
  cancelled_by?: mongoose.Types.ObjectId | string;
  cancellation_reason?: string;
  updated_by?: mongoose.Types.ObjectId | string;
}

const paymentSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  payment_number: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  // Fee reference
  fees: [{
    fee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee',
      required: true
    },
    fee_name: {
      type: String,
      required: true,
      trim: true
    },
    fee_type: {
      type: String,
      required: true,
      trim: true
    },
    installment_number: {
      type: Number
    },
    amount_due: {
      type: Number,
      required: true
    },
    amount_paid: {
      type: Number,
      required: true
    },
    balance: {
      type: Number,
      required: true
    },
    discount_applied: {
      type: Number
    },
    late_fee_applied: {
      type: Number
    }
  }],
  
  // Payment details
  payment_date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  term_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicTerm'
  },
  amount: {
    type: Number,
    required: true
  },
  discount_amount: {
    type: Number,
    required: true,
    default: 0
  },
  late_fee: {
    type: Number,
    required: true,
    default: 0
  },
  tax_amount: {
    type: Number,
    required: true,
    default: 0
  },
  total_amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  payment_method: {
    type: String,
    enum: ['cash', 'check', 'credit_card', 'debit_card', 'bank_transfer', 'online_payment', 'upi', 'wallet', 'other'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled'],
    required: true,
    default: 'pending',
    index: true
  },
  
  // Tracking info
  payment_notes: {
    type: String
  },
  remarks: {
    type: String
  },
  payment_for: {
    type: String
  },
  payment_purpose: {
    type: String,
    enum: ['regular_fee', 'admission_fee', 'fine', 'other'],
    index: true
  },
  
  // Payment info
  transaction_id: {
    type: String,
    trim: true,
    index: true
  },
  transaction_reference: {
    type: String,
    trim: true
  },
  receipt_number: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  payment_proof_url: {
    type: String
  },
  
  // Bank details (if applicable)
  bank_details: {
    bank_name: {
      type: String,
      trim: true
    },
    account_number: {
      type: String,
      trim: true
    },
    check_number: {
      type: String,
      trim: true
    },
    branch_name: {
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
    }
  },
  
  // Card details (if applicable)
  card_details: {
    card_type: {
      type: String,
      enum: ['visa', 'mastercard', 'amex', 'discover', 'other']
    },
    last_four_digits: {
      type: String,
      trim: true
    },
    card_holder_name: {
      type: String,
      trim: true
    },
    authorization_code: {
      type: String,
      trim: true
    }
  },
  
  // Online payment gateway details
  online_payment_details: {
    gateway: {
      type: String,
      trim: true
    },
    payment_id: {
      type: String,
      trim: true
    },
    order_id: {
      type: String,
      trim: true
    },
    gateway_fee: {
      type: Number
    },
    gateway_tax: {
      type: Number
    },
    gateway_response: {
      type: String
    }
  },
  
  // Refund details
  refund: {
    amount: {
      type: Number
    },
    date: {
      type: Date
    },
    reason: {
      type: String
    },
    processed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    transaction_id: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed']
    }
  },
  
  // Receipt
  receipt_generated: {
    type: Boolean,
    default: false
  },
  receipt_url: {
    type: String
  },
  receipt_generated_at: {
    type: Date
  },
  
  // Additional
  is_recurring: {
    type: Boolean,
    default: false
  },
  recurring_details: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'custom']
    },
    next_payment_date: {
      type: Date
    },
    end_date: {
      type: Date
    },
    payment_count: {
      type: Number
    },
    remaining_payments: {
      type: Number
    },
    cancellation_reason: {
      type: String
    }
  },
  
  // For audit
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelled_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellation_reason: {
    type: String
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Apply standard indexes
applyStandardIndexes(paymentSchema);

// Additional compound indexes
paymentSchema.index({ tenant_id: 1, school_id: 1, student_id: 1, payment_date: 1 });
paymentSchema.index({ tenant_id: 1, 'fees.fee_id': 1 });
paymentSchema.index({ tenant_id: 1, academic_year: 1, payment_method: 1 });
paymentSchema.index({ tenant_id: 1, payment_date: 1, status: 1 });
paymentSchema.index({ tenant_id: 1, is_recurring: 1, 'recurring_details.next_payment_date': 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
