import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IResult extends BaseDocument {
  student_id: mongoose.Types.ObjectId | string;
  class_id: mongoose.Types.ObjectId | string;
  section?: string;
  academic_year: string;
  term_id?: mongoose.Types.ObjectId | string;
  term_name?: string;
  
  // Subject results
  subject_results: {
    subject_id: mongoose.Types.ObjectId | string;
    subject_name: string;
    subject_code: string;
    max_marks: number;
    obtained_marks: number;
    percentage: number;
    grade_letter?: string;
    grade_point?: number;
    remarks?: string;
    teacher_id: mongoose.Types.ObjectId | string;
    teacher_name: string;
  }[];
  
  // Aggregated result
  total_max_marks: number;
  total_obtained_marks: number;
  overall_percentage: number;
  overall_grade_letter?: string;
  overall_grade_point?: number;
  overall_remarks?: string;
  
  rank_in_class?: number;
  rank_in_section?: number;
  
  attendance: {
    total_days: number;
    days_present: number;
    days_absent: number;
    percentage: number;
  };
  
  extra_curricular: {
    activity: string;
    performance: string;
    remarks: string;
  }[];
  
  status: 'draft' | 'published' | 'withheld';
  publish_date?: Date;
  approved_by?: mongoose.Types.ObjectId | string;
  approval_date?: Date;
  report_card_url?: string;
  
  // Progression
  is_promoted: boolean;
  promoted_to_class?: mongoose.Types.ObjectId | string;
  promoted_to_class_name?: string;
}

const resultSchema = createSchema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
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
  term_name: {
    type: String,
    trim: true
  },
  
  // Subject results
  subject_results: [{
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    subject_name: {
      type: String,
      required: true,
      trim: true
    },
    subject_code: {
      type: String,
      required: true,
      trim: true
    },
    max_marks: {
      type: Number,
      required: true
    },
    obtained_marks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    grade_letter: {
      type: String,
      trim: true
    },
    grade_point: {
      type: Number
    },
    remarks: {
      type: String
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teacher_name: {
      type: String,
      required: true,
      trim: true
    }
  }],
  
  // Aggregated result
  total_max_marks: {
    type: Number,
    required: true
  },
  total_obtained_marks: {
    type: Number,
    required: true
  },
  overall_percentage: {
    type: Number,
    required: true
  },
  overall_grade_letter: {
    type: String,
    trim: true
  },
  overall_grade_point: {
    type: Number
  },
  overall_remarks: {
    type: String
  },
  
  rank_in_class: {
    type: Number
  },
  rank_in_section: {
    type: Number
  },
  
  attendance: {
    total_days: {
      type: Number,
      default: 0
    },
    days_present: {
      type: Number,
      default: 0
    },
    days_absent: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  
  extra_curricular: [{
    activity: {
      type: String,
      required: true,
      trim: true
    },
    performance: {
      type: String,
      required: true,
      trim: true
    },
    remarks: {
      type: String,
      trim: true
    }
  }],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'withheld'],
    required: true,
    default: 'draft',
    index: true
  },
  publish_date: {
    type: Date
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approval_date: {
    type: Date
  },
  report_card_url: {
    type: String
  },
  
  // Progression
  is_promoted: {
    type: Boolean,
    default: false
  },
  promoted_to_class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  promoted_to_class_name: {
    type: String,
    trim: true
  }
});

// Apply standard indexes
applyStandardIndexes(resultSchema);

// Additional compound indexes
resultSchema.index({ tenant_id: 1, student_id: 1, academic_year: 1, term_id: 1 }, { unique: true });
resultSchema.index({ tenant_id: 1, class_id: 1, section: 1, academic_year: 1 });
resultSchema.index({ tenant_id: 1, status: 1, publish_date: 1 });
resultSchema.index({ 'subject_results.subject_id': 1, 'subject_results.teacher_id': 1 });

export default mongoose.models.Result || mongoose.model<IResult>('Result', resultSchema);
