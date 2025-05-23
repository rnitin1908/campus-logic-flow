import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IParent extends BaseDocument {
  user_id: mongoose.Types.ObjectId | string;
  school_id: mongoose.Types.ObjectId | string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  email: string;
  contact_number: string;
  alternate_contact?: string;
  profession?: string;
  employer?: string;
  annual_income?: number;
  education?: string;
  students: {
    student_id: mongoose.Types.ObjectId | string;
    is_emergency_contact: boolean;
    relationship: 'father' | 'mother' | 'guardian' | 'other';
    has_custody: boolean;
    access_level: 'full' | 'limited' | 'readonly';
  }[];
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  photo_url?: string;
  identification_type?: string;
  identification_number?: string;
  emergency_contact: {
    name: string;
    relationship: string;
    contact_number: string;
  };
  notes?: string;
  is_verified: boolean;
  verification_date?: Date;
}

const parentSchema = createSchema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
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
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    enum: ['father', 'mother', 'guardian', 'other'],
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  contact_number: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  alternate_contact: {
    type: String,
    trim: true
  },
  profession: {
    type: String,
    trim: true
  },
  employer: {
    type: String,
    trim: true
  },
  annual_income: {
    type: Number
  },
  education: {
    type: String,
    trim: true
  },
  students: [{
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    is_emergency_contact: {
      type: Boolean,
      default: true
    },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other'],
      required: true
    },
    has_custody: {
      type: Boolean,
      default: true
    },
    access_level: {
      type: String,
      enum: ['full', 'limited', 'readonly'],
      default: 'full'
    }
  }],
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
  photo_url: {
    type: String
  },
  identification_type: {
    type: String,
    trim: true
  },
  identification_number: {
    type: String,
    trim: true
  },
  emergency_contact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    relationship: {
      type: String,
      required: true,
      trim: true
    },
    contact_number: {
      type: String,
      required: true,
      trim: true
    }
  },
  notes: {
    type: String
  },
  is_verified: {
    type: Boolean,
    default: false,
    index: true
  },
  verification_date: {
    type: Date
  }
});

// Pre-save middleware to generate full_name
parentSchema.pre('save', function(next) {
  if (this.isModified('first_name') || this.isModified('middle_name') || this.isModified('last_name')) {
    if (this.middle_name) {
      this.full_name = `${this.first_name} ${this.middle_name} ${this.last_name}`;
    } else {
      this.full_name = `${this.first_name} ${this.last_name}`;
    }
  }
  next();
});

// Apply standard indexes
applyStandardIndexes(parentSchema);

// Additional compound indexes
parentSchema.index({ tenant_id: 1, school_id: 1, email: 1 }, { unique: true });
parentSchema.index({ tenant_id: 1, school_id: 1, contact_number: 1 });
parentSchema.index({ 'students.student_id': 1 });

export default mongoose.models.Parent || mongoose.model<IParent>('Parent', parentSchema);
