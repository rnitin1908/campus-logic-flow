import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';
import { GenderType } from './Student';

export type AdmissionStatusType = 'pending' | 'under_review' | 'approved' | 'rejected' | 'waitlisted' | 'enrolled' | 'canceled';

export interface IAdmissionRequest extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  application_number: string;
  student_name: {
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
  date_of_birth: Date;
  gender: GenderType;
  academic_year: string;
  grade_applying_for: string;
  previous_school?: string;
  parent_id: mongoose.Types.ObjectId | string;
  contact_details: {
    email: string;
    phone: string;
    alternate_phone?: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  documents: {
    name: string;
    type: string;
    url: string;
    uploaded_at: Date;
    is_verified: boolean;
  }[];
  application_date: Date;
  status: AdmissionStatusType;
  admission_test_score?: number;
  interview_date?: Date;
  interview_notes?: string;
  assigned_to?: mongoose.Types.ObjectId | string;
  status_history: {
    status: AdmissionStatusType;
    changed_at: Date;
    changed_by: mongoose.Types.ObjectId | string;
    notes?: string;
  }[];
  fees_paid?: {
    amount: number;
    transaction_id: string;
    payment_date: Date;
    payment_method: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
  };
  special_requirements?: string;
  scholarship_applied?: boolean;
  scholarship_details?: {
    type: string;
    amount: number;
    status: 'applied' | 'approved' | 'rejected' | 'pending';
  };
  notes?: string;
}

const admissionRequestSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  application_number: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  student_name: {
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    middle_name: {
      type: String,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    }
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  grade_applying_for: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  previous_school: {
    type: String,
    trim: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  contact_details: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    alternate_phone: {
      type: String,
      trim: true
    }
  },
  address: {
    line1: {
      type: String,
      required: true,
      trim: true
    },
    line2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    postal_code: {
      type: String,
      required: true,
      trim: true
    }
  },
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    },
    is_verified: {
      type: Boolean,
      default: false
    }
  }],
  application_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'enrolled', 'canceled'],
    default: 'pending',
    required: true,
    index: true
  },
  admission_test_score: {
    type: Number
  },
  interview_date: {
    type: Date
  },
  interview_notes: {
    type: String
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status_history: [{
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'enrolled', 'canceled'],
      required: true
    },
    changed_at: {
      type: Date,
      required: true,
      default: Date.now
    },
    changed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: {
      type: String
    }
  }],
  fees_paid: {
    amount: {
      type: Number
    },
    transaction_id: {
      type: String,
      trim: true
    },
    payment_date: {
      type: Date
    },
    payment_method: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded']
    }
  },
  special_requirements: {
    type: String
  },
  scholarship_applied: {
    type: Boolean,
    default: false
  },
  scholarship_details: {
    type: {
      type: String,
      trim: true
    },
    amount: {
      type: Number
    },
    status: {
      type: String,
      enum: ['applied', 'approved', 'rejected', 'pending']
    }
  },
  notes: {
    type: String
  }
});

// Apply standard indexes
applyStandardIndexes(admissionRequestSchema);

// Additional compound indexes
admissionRequestSchema.index({ tenant_id: 1, school_id: 1, application_number: 1 }, { unique: true });
admissionRequestSchema.index({ tenant_id: 1, school_id: 1, status: 1 });
admissionRequestSchema.index({ tenant_id: 1, school_id: 1, academic_year: 1 });
admissionRequestSchema.index({ tenant_id: 1, parent_id: 1 });
admissionRequestSchema.index({ assigned_to: 1 });
admissionRequestSchema.index({ 'contact_details.email': 1 });

export default mongoose.models.AdmissionRequest || mongoose.model<IAdmissionRequest>('AdmissionRequest', admissionRequestSchema);
