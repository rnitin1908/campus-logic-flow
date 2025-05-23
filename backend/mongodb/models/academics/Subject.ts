import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface ISubject extends BaseDocument {
  name: string;
  code: string;
  description?: string;
  school_id: mongoose.Types.ObjectId | string;
  department_id: mongoose.Types.ObjectId | string;
  credit_hours?: number;
  grade_level?: number[];
  is_elective: boolean;
  syllabus?: string;
  passing_marks?: number;
  total_marks?: number;
  teachers: mongoose.Types.ObjectId[] | string[];
}

const subjectSchema = createSchema({
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
  credit_hours: {
    type: Number
  },
  grade_level: [{
    type: Number
  }],
  is_elective: {
    type: Boolean,
    default: false
  },
  syllabus: {
    type: String
  },
  passing_marks: {
    type: Number
  },
  total_marks: {
    type: Number
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Apply standard indexes
applyStandardIndexes(subjectSchema);

// Additional compound indexes
subjectSchema.index({ tenant_id: 1, school_id: 1, code: 1 }, { unique: true });
subjectSchema.index({ tenant_id: 1, school_id: 1, department_id: 1 });

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', subjectSchema);
