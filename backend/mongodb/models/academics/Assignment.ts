import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IAssignment extends BaseDocument {
  title: string;
  description: string;
  course_id: mongoose.Types.ObjectId | string;
  class_id: mongoose.Types.ObjectId | string;
  subject_id: mongoose.Types.ObjectId | string;
  teacher_id: mongoose.Types.ObjectId | string;
  due_date: Date;
  publish_date: Date;
  total_marks: number;
  assignment_type: 'individual' | 'group';
  attachment_urls?: string[];
  submission_type: 'file' | 'text' | 'link' | 'mixed';
  status: 'draft' | 'published' | 'archived';
  grading_status: 'not_started' | 'in_progress' | 'completed';
  allow_late_submission: boolean;
  late_submission_deadline?: Date;
  late_submission_penalty?: number;
  instructions?: string;
  rubric?: {
    criteria: string;
    description: string;
    max_points: number;
  }[];
}

const assignmentSchema = createSchema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    index: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  due_date: {
    type: Date,
    required: true,
    index: true
  },
  publish_date: {
    type: Date,
    required: true,
    index: true
  },
  total_marks: {
    type: Number,
    required: true
  },
  assignment_type: {
    type: String,
    enum: ['individual', 'group'],
    required: true,
    default: 'individual'
  },
  attachment_urls: [{
    type: String
  }],
  submission_type: {
    type: String,
    enum: ['file', 'text', 'link', 'mixed'],
    required: true,
    default: 'file'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    required: true,
    default: 'draft',
    index: true
  },
  grading_status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    required: true,
    default: 'not_started',
    index: true
  },
  allow_late_submission: {
    type: Boolean,
    default: false
  },
  late_submission_deadline: {
    type: Date
  },
  late_submission_penalty: {
    type: Number,
    min: 0,
    max: 100
  },
  instructions: {
    type: String
  },
  rubric: [{
    criteria: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    max_points: {
      type: Number,
      required: true
    }
  }]
});

// Apply standard indexes
applyStandardIndexes(assignmentSchema);

// Additional compound indexes
assignmentSchema.index({ tenant_id: 1, course_id: 1, due_date: 1 });
assignmentSchema.index({ tenant_id: 1, class_id: 1, subject_id: 1 });
assignmentSchema.index({ tenant_id: 1, teacher_id: 1, due_date: 1 });
assignmentSchema.index({ tenant_id: 1, publish_date: 1, status: 1 });

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', assignmentSchema);
