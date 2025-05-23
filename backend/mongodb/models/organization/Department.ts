import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IDepartment extends BaseDocument {
  name: string;
  code: string;
  description?: string;
  school_id: mongoose.Types.ObjectId | string;
  head_of_department?: mongoose.Types.ObjectId | string;
  contact_email?: string;
  contact_phone?: string;
  location?: string;
  type: 'academic' | 'administrative' | 'support';
  settings: Record<string, any>;
}

const departmentSchema = createSchema({
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
  head_of_department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contact_email: {
    type: String,
    trim: true,
    lowercase: true
  },
  contact_phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['academic', 'administrative', 'support'],
    required: true,
    default: 'academic'
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Apply standard indexes
applyStandardIndexes(departmentSchema);

// Additional compound indexes
departmentSchema.index({ tenant_id: 1, school_id: 1, code: 1 }, { unique: true });
departmentSchema.index({ tenant_id: 1, school_id: 1, name: 1 });
departmentSchema.index({ head_of_department: 1 });

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', departmentSchema);
