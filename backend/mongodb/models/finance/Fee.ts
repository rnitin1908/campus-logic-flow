import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type FeeFrequencyType = 'one_time' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'custom';
export type FeeStatusType = 'active' | 'inactive' | 'pending_approval' | 'archived';

export interface IFee extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  fee_type: 'tuition' | 'admission' | 'examination' | 'transportation' | 'hostel' | 'library' | 'laboratory' | 'sports' | 'technology' | 'miscellaneous' | 'other';
  
  // Fee structure
  amount: number;
  currency: string;
  is_taxable: boolean;
  tax_percentage?: number;
  tax_amount?: number;
  total_amount: number;
  discount_applicable: boolean;
  
  // Applicability
  academic_year: string;
  term_id?: mongoose.Types.ObjectId | string;
  applicable_to: {
    all_students: boolean;
    specific_classes: boolean;
    specific_categories: boolean;
    class_ids?: mongoose.Types.ObjectId[] | string[];
    category_ids?: mongoose.Types.ObjectId[] | string[];
  };
  
  // Payment schedule
  frequency: FeeFrequencyType;
  due_date: Date;
  grace_period_days: number;
  late_fee: {
    fixed_amount?: number;
    percentage?: number;
    recurring: boolean;
    recurring_interval_days?: number;
    max_late_fee?: number;
  };
  
  // Installments
  allow_installments: boolean;
  installment_details?: {
    number_of_installments: number;
    installment_schedule: {
      installment_number: number;
      due_date: Date;
      amount: number;
      description: string;
    }[];
  };
  
  // Discounts
  discounts?: {
    name: string;
    type: 'fixed' | 'percentage';
    value: number;
    applicable_to: 'all' | 'category' | 'specific_students';
    category_ids?: mongoose.Types.ObjectId[] | string[];
    student_ids?: mongoose.Types.ObjectId[] | string[];
    description?: string;
  }[];
  
  // Fee tracking
  is_mandatory: boolean;
  is_refundable: boolean;
  refund_policy?: string;
  status: FeeStatusType;
  effective_from: Date;
  effective_until?: Date;
  
  // System information
  fee_code: string;
  account_code?: string;
  created_by: mongoose.Types.ObjectId | string;
  approved_by?: mongoose.Types.ObjectId | string;
  updated_by?: mongoose.Types.ObjectId | string;
}

const feeSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fee_type: {
    type: String,
    enum: ['tuition', 'admission', 'examination', 'transportation', 'hostel', 'library', 'laboratory', 'sports', 'technology', 'miscellaneous', 'other'],
    required: true,
    index: true
  },
  
  // Fee structure
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  is_taxable: {
    type: Boolean,
    default: false
  },
  tax_percentage: {
    type: Number
  },
  tax_amount: {
    type: Number
  },
  total_amount: {
    type: Number,
    required: true
  },
  discount_applicable: {
    type: Boolean,
    default: true
  },
  
  // Applicability
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
  applicable_to: {
    all_students: {
      type: Boolean,
      default: false
    },
    specific_classes: {
      type: Boolean,
      default: false
    },
    specific_categories: {
      type: Boolean,
      default: false
    },
    class_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }],
    category_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }]
  },
  
  // Payment schedule
  frequency: {
    type: String,
    enum: ['one_time', 'monthly', 'quarterly', 'semi_annual', 'annual', 'custom'],
    required: true,
    default: 'one_time'
  },
  due_date: {
    type: Date,
    required: true,
    index: true
  },
  grace_period_days: {
    type: Number,
    default: 0
  },
  late_fee: {
    fixed_amount: {
      type: Number
    },
    percentage: {
      type: Number
    },
    recurring: {
      type: Boolean,
      default: false
    },
    recurring_interval_days: {
      type: Number
    },
    max_late_fee: {
      type: Number
    }
  },
  
  // Installments
  allow_installments: {
    type: Boolean,
    default: false
  },
  installment_details: {
    number_of_installments: {
      type: Number
    },
    installment_schedule: [{
      installment_number: {
        type: Number,
        required: true
      },
      due_date: {
        type: Date,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }]
  },
  
  // Discounts
  discounts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    applicable_to: {
      type: String,
      enum: ['all', 'category', 'specific_students'],
      required: true
    },
    category_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    student_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }],
    description: {
      type: String
    }
  }],
  
  // Fee tracking
  is_mandatory: {
    type: Boolean,
    default: true
  },
  is_refundable: {
    type: Boolean,
    default: false
  },
  refund_policy: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_approval', 'archived'],
    required: true,
    default: 'active',
    index: true
  },
  effective_from: {
    type: Date,
    required: true,
    index: true
  },
  effective_until: {
    type: Date,
    index: true
  },
  
  // System information
  fee_code: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  account_code: {
    type: String,
    trim: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Apply standard indexes
applyStandardIndexes(feeSchema);

// Additional compound indexes
feeSchema.index({ tenant_id: 1, school_id: 1, fee_type: 1, academic_year: 1 });
feeSchema.index({ tenant_id: 1, 'applicable_to.class_ids': 1 });
feeSchema.index({ tenant_id: 1, 'applicable_to.category_ids': 1 });
feeSchema.index({ tenant_id: 1, status: 1, effective_from: 1, effective_until: 1 });

export default mongoose.models.Fee || mongoose.model<IFee>('Fee', feeSchema);
