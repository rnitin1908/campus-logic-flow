import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IGrade extends BaseDocument {
  student_id: mongoose.Types.ObjectId | string;
  class_id: mongoose.Types.ObjectId | string;
  section?: string;
  subject_id: mongoose.Types.ObjectId | string;
  course_id?: mongoose.Types.ObjectId | string;
  academic_year: string;
  term_id?: mongoose.Types.ObjectId | string;
  term_name?: string;
  teacher_id: mongoose.Types.ObjectId | string;
  
  // Grade components
  assignments: {
    assignment_id: mongoose.Types.ObjectId | string;
    title: string;
    max_marks: number;
    obtained_marks: number;
    graded_date: Date;
    comments?: string;
    is_late_submission: boolean;
    penalty_applied?: number;
  }[];
  
  exams: {
    exam_id: mongoose.Types.ObjectId | string;
    title: string;
    max_marks: number;
    obtained_marks: number;
    graded_date: Date;
    comments?: string;
  }[];
  
  class_participation: {
    max_marks: number;
    obtained_marks: number;
    comments?: string;
  };
  
  attendance: {
    total_classes: number;
    classes_attended: number;
    percentage: number;
  };
  
  projects: {
    project_id?: mongoose.Types.ObjectId | string;
    title: string;
    max_marks: number;
    obtained_marks: number;
    graded_date: Date;
    comments?: string;
  }[];
  
  // Calculated fields
  total_max_marks: number;
  total_obtained_marks: number;
  percentage: number;
  grade_letter?: string;
  grade_point?: number;
  remarks?: string;
  is_published: boolean;
  published_date?: Date;
}

const gradeSchema = createSchema({
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
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    index: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
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
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Grade components
  assignments: [{
    assignment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    },
    title: {
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
    graded_date: {
      type: Date,
      default: Date.now
    },
    comments: {
      type: String
    },
    is_late_submission: {
      type: Boolean,
      default: false
    },
    penalty_applied: {
      type: Number
    }
  }],
  
  exams: [{
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam'
    },
    title: {
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
    graded_date: {
      type: Date,
      default: Date.now
    },
    comments: {
      type: String
    }
  }],
  
  class_participation: {
    max_marks: {
      type: Number,
      default: 0
    },
    obtained_marks: {
      type: Number,
      default: 0
    },
    comments: {
      type: String
    }
  },
  
  attendance: {
    total_classes: {
      type: Number,
      default: 0
    },
    classes_attended: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  
  projects: [{
    project_id: {
      type: mongoose.Schema.Types.ObjectId
    },
    title: {
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
    graded_date: {
      type: Date,
      default: Date.now
    },
    comments: {
      type: String
    }
  }],
  
  // Calculated fields
  total_max_marks: {
    type: Number,
    required: true
  },
  total_obtained_marks: {
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
  is_published: {
    type: Boolean,
    default: false,
    index: true
  },
  published_date: {
    type: Date
  }
});

// Apply standard indexes
applyStandardIndexes(gradeSchema);

// Additional compound indexes
gradeSchema.index({ tenant_id: 1, student_id: 1, subject_id: 1, academic_year: 1 }, { unique: true });
gradeSchema.index({ tenant_id: 1, class_id: 1, subject_id: 1 });
gradeSchema.index({ tenant_id: 1, teacher_id: 1, academic_year: 1 });
gradeSchema.index({ tenant_id: 1, term_id: 1 });
gradeSchema.index({ tenant_id: 1, is_published: 1 });

export default mongoose.models.Grade || mongoose.model<IGrade>('Grade', gradeSchema);
