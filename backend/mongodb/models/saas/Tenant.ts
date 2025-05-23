import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface ITenant extends Document {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  slug: string;
  domain: string;
  custom_domains: string[];
  logo?: string;
  contact_email: string;
  contact_phone: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  subscription_plan: string;
  subscription_status: 'active' | 'trial' | 'past_due' | 'canceled' | 'unpaid';
  trial_ends_at?: Date;
  current_period_ends_at?: Date;
  billing_customer_id?: string;
  billing_subscription_id?: string;
  billing_payment_method_id?: string;
  max_users: number;
  max_storage: number; // in MB
  features: Record<string, boolean>;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_deleted: boolean;
}

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  domain: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  custom_domains: [{
    type: String,
    trim: true
  }],
  logo: {
    type: String
  },
  contact_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contact_phone: {
    type: String,
    trim: true
  },
  address: {
    line1: {
      type: String,
      trim: true
    },
    line2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    postal_code: {
      type: String,
      trim: true
    }
  },
  subscription_plan: {
    type: String,
    required: true,
    default: 'free',
    index: true
  },
  subscription_status: {
    type: String,
    enum: ['active', 'trial', 'past_due', 'canceled', 'unpaid'],
    default: 'trial',
    index: true
  },
  trial_ends_at: {
    type: Date
  },
  current_period_ends_at: {
    type: Date
  },
  billing_customer_id: {
    type: String
  },
  billing_subscription_id: {
    type: String
  },
  billing_payment_method_id: {
    type: String
  },
  max_users: {
    type: Number,
    default: 10
  },
  max_storage: {
    type: Number,
    default: 1000 // 1GB in MB
  },
  features: {
    type: Map,
    of: Boolean,
    default: {}
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  is_deleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ domain: 1 }, { unique: true });
tenantSchema.index({ 'custom_domains': 1 });
tenantSchema.index({ subscription_status: 1 });
tenantSchema.index({ created_at: -1 });

export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', tenantSchema);
