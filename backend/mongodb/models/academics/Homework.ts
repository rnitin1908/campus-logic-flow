import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IHomework extends BaseDocument {
  title: string;
  description: string;
  class_id: mongoose.Types.ObjectId | string;
  section?: string;
  subject_id: mongoose.Types.ObjectId | string;
  teacher_id: mongoose.Types.ObjectId | string;
  assigned_date: Date;
  due_date: Date;
  attachment_urls?: string[];
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  estimated_completion_time?: number; // in minutes
  instructions?: string;
  is_graded: boolean;
  total_marks?: number;
}

const homeworkSchema = createSchema({
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
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  assigned_date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  due_date: {
    type: Date,
    required: true,
    index: true
  },
  attachment_urls: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    required: true,
    default: 'active',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
    default: 'medium'
  },
  estimated_completion_time: {
    type: Number
  },
  instructions: {
    type: String
  },
  is_graded: {
    type: Boolean,
    default: false
  },
  total_marks: {
    type: Number
  }
});

// Apply standard indexes
applyStandardIndexes(homeworkSchema);

// Additional compound indexes
homeworkSchema.index({ tenant_id: 1, class_id: 1, subject_id: 1, due_date: 1 });
homeworkSchema.index({ tenant_id: 1, teacher_id: 1, due_date: 1 });
homeworkSchema.index({ tenant_id: 1, class_id: 1, section: 1, due_date: 1 });
homeworkSchema.index({ tenant_id: 1, status: 1, due_date: 1 });

export default mongoose.models.Homework || mongoose.model<IHomework>('Homework', homeworkSchema);
