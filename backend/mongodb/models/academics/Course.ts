import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface ICourse extends BaseDocument {
  name: string;
  code: string;
  description?: string;
  school_id: mongoose.Types.ObjectId | string;
  department_id: mongoose.Types.ObjectId | string;
  subject_id: mongoose.Types.ObjectId | string;
  academic_year: string;
  grade_level: number;
  teacher_id: mongoose.Types.ObjectId | string;
  start_date: Date;
  end_date: Date;
  class_ids: mongoose.Types.ObjectId[] | string[];
  syllabus_url?: string;
  course_materials: {
    title: string;
    description?: string;
    type: 'document' | 'video' | 'link' | 'other';
    url: string;
    uploaded_at: Date;
  }[];
  grading_criteria?: {
    assignments: number;
    exams: number;
    attendance: number;
    projects: number;
    other: number;
  };
  status: 'active' | 'completed' | 'upcoming' | 'archived';
}

const courseSchema = createSchema({
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
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    index: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    index: true
  },
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  grade_level: {
    type: Number,
    required: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  class_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  syllabus_url: {
    type: String
  },
  course_materials: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  grading_criteria: {
    assignments: {
      type: Number,
      min: 0,
      max: 100
    },
    exams: {
      type: Number,
      min: 0,
      max: 100
    },
    attendance: {
      type: Number,
      min: 0,
      max: 100
    },
    projects: {
      type: Number,
      min: 0,
      max: 100
    },
    other: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'upcoming', 'archived'],
    default: 'upcoming',
    required: true,
    index: true
  }
});

// Apply standard indexes
applyStandardIndexes(courseSchema);

// Additional compound indexes
courseSchema.index({ tenant_id: 1, school_id: 1, code: 1, academic_year: 1 }, { unique: true });
courseSchema.index({ tenant_id: 1, teacher_id: 1, academic_year: 1 });
courseSchema.index({ tenant_id: 1, subject_id: 1 });
courseSchema.index({ tenant_id: 1, 'class_ids': 1 });

export default mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);
