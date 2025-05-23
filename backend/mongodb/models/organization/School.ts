import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface ISchool extends BaseDocument {
  name: string;
  code: string;
  description?: string;
  logo?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  contact_info: {
    email: string;
    phone: string;
    website?: string;
    social_media?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    }
  };
  principal_name?: string;
  established_year?: number;
  accreditation?: string[];
  registration_number?: string;
  type: 'primary' | 'secondary' | 'college' | 'university' | 'vocational';
  academic_year_start_month: number; // 1-12 for January-December
  academic_year_end_month: number; // 1-12 for January-December
  time_zone: string;
  currency: string;
  settings: Record<string, any>;
}

const schoolSchema = createSchema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String
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
  contact_info: {
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
    website: {
      type: String,
      trim: true
    },
    social_media: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String
    }
  },
  principal_name: {
    type: String,
    trim: true
  },
  established_year: {
    type: Number
  },
  accreditation: [{
    type: String,
    trim: true
  }],
  registration_number: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['primary', 'secondary', 'college', 'university', 'vocational'],
    required: true
  },
  academic_year_start_month: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  academic_year_end_month: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  time_zone: {
    type: String,
    required: true,
    default: 'UTC'
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Apply standard indexes
applyStandardIndexes(schoolSchema);

// Additional compound indexes
schoolSchema.index({ tenant_id: 1, code: 1 }, { unique: true });
schoolSchema.index({ tenant_id: 1, name: 1 });
schoolSchema.index({ 'address.city': 1, 'address.state': 1 });

export default mongoose.models.School || mongoose.model<ISchool>('School', schoolSchema);
