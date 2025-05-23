import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IProgressReport extends BaseDocument {
  student_id: mongoose.Types.ObjectId | string;
  class_id: mongoose.Types.ObjectId | string;
  section?: string;
  academic_year: string;
  term_id?: mongoose.Types.ObjectId | string;
  term_name?: string;
  report_date: Date;
  report_type: 'monthly' | 'quarterly' | 'midterm' | 'final' | 'custom';
  
  academic_performance: {
    subject_id: mongoose.Types.ObjectId | string;
    subject_name: string;
    current_grade: string;
    previous_grade?: string;
    progress: 'improving' | 'steady' | 'declining' | 'not_applicable';
    teacher_comments?: string;
    areas_of_strength?: string[];
    areas_for_improvement?: string[];
    teacher_id: mongoose.Types.ObjectId | string;
  }[];
  
  attendance_summary: {
    total_days: number;
    days_present: number;
    days_absent: number;
    days_late: number;
    attendance_percentage: number;
    trend: 'improving' | 'steady' | 'declining' | 'not_applicable';
  };
  
  behavior_assessment: {
    category: string;
    rating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
    comments?: string;
  }[];
  
  skills_assessment: {
    skill: string;
    rating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
    comments?: string;
  }[];
  
  overall_assessment: {
    overall_comments: string;
    areas_of_strength: string[];
    areas_for_improvement: string[];
    recommended_actions: string[];
  };
  
  extracurricular_activities: {
    activity: string;
    performance: string;
    comments?: string;
  }[];
  
  teacher_comments: string;
  principal_comments?: string;
  parent_comments?: string;
  parent_meeting_required: boolean;
  parent_meeting_date?: Date;
  
  is_published: boolean;
  published_date?: Date;
  is_acknowledged_by_parent: boolean;
  acknowledged_date?: Date;
  acknowledged_by?: mongoose.Types.ObjectId | string;
  report_url?: string;
}

const progressReportSchema = createSchema({
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
  report_date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  report_type: {
    type: String,
    enum: ['monthly', 'quarterly', 'midterm', 'final', 'custom'],
    required: true,
    index: true
  },
  
  academic_performance: [{
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
    current_grade: {
      type: String,
      required: true,
      trim: true
    },
    previous_grade: {
      type: String,
      trim: true
    },
    progress: {
      type: String,
      enum: ['improving', 'steady', 'declining', 'not_applicable'],
      default: 'not_applicable'
    },
    teacher_comments: {
      type: String
    },
    areas_of_strength: [{
      type: String,
      trim: true
    }],
    areas_for_improvement: [{
      type: String,
      trim: true
    }],
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  attendance_summary: {
    total_days: {
      type: Number,
      required: true,
      default: 0
    },
    days_present: {
      type: Number,
      required: true,
      default: 0
    },
    days_absent: {
      type: Number,
      required: true,
      default: 0
    },
    days_late: {
      type: Number,
      required: true,
      default: 0
    },
    attendance_percentage: {
      type: Number,
      required: true,
      default: 0
    },
    trend: {
      type: String,
      enum: ['improving', 'steady', 'declining', 'not_applicable'],
      default: 'not_applicable'
    }
  },
  
  behavior_assessment: [{
    category: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: String,
      enum: ['excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory'],
      required: true
    },
    comments: {
      type: String
    }
  }],
  
  skills_assessment: [{
    skill: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: String,
      enum: ['excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory'],
      required: true
    },
    comments: {
      type: String
    }
  }],
  
  overall_assessment: {
    overall_comments: {
      type: String,
      required: true
    },
    areas_of_strength: [{
      type: String,
      trim: true
    }],
    areas_for_improvement: [{
      type: String,
      trim: true
    }],
    recommended_actions: [{
      type: String,
      trim: true
    }]
  },
  
  extracurricular_activities: [{
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
    comments: {
      type: String
    }
  }],
  
  teacher_comments: {
    type: String,
    required: true
  },
  principal_comments: {
    type: String
  },
  parent_comments: {
    type: String
  },
  parent_meeting_required: {
    type: Boolean,
    default: false
  },
  parent_meeting_date: {
    type: Date
  },
  
  is_published: {
    type: Boolean,
    default: false,
    index: true
  },
  published_date: {
    type: Date
  },
  is_acknowledged_by_parent: {
    type: Boolean,
    default: false,
    index: true
  },
  acknowledged_date: {
    type: Date
  },
  acknowledged_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  report_url: {
    type: String
  }
});

// Apply standard indexes
applyStandardIndexes(progressReportSchema);

// Additional compound indexes
progressReportSchema.index({ tenant_id: 1, student_id: 1, academic_year: 1, term_id: 1, report_type: 1 });
progressReportSchema.index({ tenant_id: 1, class_id: 1, section: 1 });
progressReportSchema.index({ tenant_id: 1, is_published: 1, report_date: 1 });
progressReportSchema.index({ tenant_id: 1, parent_meeting_required: 1, parent_meeting_date: 1 });

export default mongoose.models.ProgressReport || mongoose.model<IProgressReport>('ProgressReport', progressReportSchema);
