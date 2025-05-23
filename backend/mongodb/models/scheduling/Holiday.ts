import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IHoliday extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  is_recurring: boolean;
  recurrence_pattern?: 'yearly' | 'custom';
  custom_recurrence_rule?: string;
  holiday_type: 'national' | 'religious' | 'local' | 'school_specific' | 'other';
  applies_to: {
    all_branches: boolean;
    specific_branches: boolean;
    branch_ids?: mongoose.Types.ObjectId[] | string[];
  };
  academic_year?: string;
  is_half_day: boolean;
  is_optional: boolean;
  icon?: string;
  color?: string;
  created_by: mongoose.Types.ObjectId | string;
  updated_by?: mongoose.Types.ObjectId | string;
}

const holidaySchema = createSchema({
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
  start_date: {
    type: Date,
    required: true,
    index: true
  },
  end_date: {
    type: Date,
    required: true,
    index: true
  },
  is_recurring: {
    type: Boolean,
    default: false
  },
  recurrence_pattern: {
    type: String,
    enum: ['yearly', 'custom'],
    default: 'yearly'
  },
  custom_recurrence_rule: {
    type: String
  },
  holiday_type: {
    type: String,
    enum: ['national', 'religious', 'local', 'school_specific', 'other'],
    required: true,
    index: true
  },
  applies_to: {
    all_branches: {
      type: Boolean,
      default: true
    },
    specific_branches: {
      type: Boolean,
      default: false
    },
    branch_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch'
    }]
  },
  academic_year: {
    type: String,
    trim: true,
    index: true
  },
  is_half_day: {
    type: Boolean,
    default: false
  },
  is_optional: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  color: {
    type: String
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Apply standard indexes
applyStandardIndexes(holidaySchema);

// Additional compound indexes
holidaySchema.index({ tenant_id: 1, school_id: 1, start_date: 1, end_date: 1 });
holidaySchema.index({ tenant_id: 1, school_id: 1, holiday_type: 1 });
holidaySchema.index({ tenant_id: 1, school_id: 1, academic_year: 1 });
holidaySchema.index({ tenant_id: 1, 'applies_to.branch_ids': 1 });
holidaySchema.index({ tenant_id: 1, is_recurring: 1 });

export default mongoose.models.Holiday || mongoose.model<IHoliday>('Holiday', holidaySchema);
