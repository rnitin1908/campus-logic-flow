import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface ITimetable extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  class_id: mongoose.Types.ObjectId | string;
  section?: string;
  academic_year: string;
  term_id?: mongoose.Types.ObjectId | string;
  effective_from: Date;
  effective_until?: Date;
  is_active: boolean;
  
  // Schedule structure
  periods_per_day: number;
  days_of_week: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  time_slots: {
    period_number: number;
    start_time: string;
    end_time: string;
    is_break: boolean;
    break_type?: 'lunch' | 'short_break' | 'assembly' | 'other';
  }[];
  
  // Schedule entries
  schedule: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    periods: {
      period_number: number;
      subject_id?: mongoose.Types.ObjectId | string;
      subject_name?: string;
      teacher_id?: mongoose.Types.ObjectId | string;
      teacher_name?: string;
      room?: string;
      is_free_period: boolean;
      notes?: string;
    }[];
  }[];
  
  created_by: mongoose.Types.ObjectId | string;
  approved_by?: mongoose.Types.ObjectId | string;
  approval_date?: Date;
  version: number;
  notes?: string;
}

const timetableSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  section: {
    type: String,
    trim: true
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
  effective_from: {
    type: Date,
    required: true,
    index: true
  },
  effective_until: {
    type: Date,
    index: true
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Schedule structure
  periods_per_day: {
    type: Number,
    required: true
  },
  days_of_week: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  }],
  time_slots: [{
    period_number: {
      type: Number,
      required: true
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: {
      type: String,
      required: true
    },
    is_break: {
      type: Boolean,
      default: false
    },
    break_type: {
      type: String,
      enum: ['lunch', 'short_break', 'assembly', 'other']
    }
  }],
  
  // Schedule entries
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    periods: [{
      period_number: {
        type: Number,
        required: true
      },
      subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      },
      subject_name: {
        type: String,
        trim: true
      },
      teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      teacher_name: {
        type: String,
        trim: true
      },
      room: {
        type: String,
        trim: true
      },
      is_free_period: {
        type: Boolean,
        default: false
      },
      notes: {
        type: String
      }
    }]
  }],
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approval_date: {
    type: Date
  },
  version: {
    type: Number,
    required: true,
    default: 1
  },
  notes: {
    type: String
  }
});

// Apply standard indexes
applyStandardIndexes(timetableSchema);

// Additional compound indexes
timetableSchema.index({ tenant_id: 1, school_id: 1, class_id: 1, section: 1, academic_year: 1, is_active: 1 });
timetableSchema.index({ tenant_id: 1, effective_from: 1, effective_until: 1 });
timetableSchema.index({ 'schedule.periods.teacher_id': 1 });
timetableSchema.index({ 'schedule.periods.subject_id': 1 });

export default mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', timetableSchema);
