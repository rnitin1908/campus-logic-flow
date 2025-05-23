import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IClass extends BaseDocument {
  name: string;
  code: string;
  description?: string;
  school_id: mongoose.Types.ObjectId | string;
  department_id: mongoose.Types.ObjectId | string;
  grade_level: number;
  academic_year: string;
  class_teacher_id?: mongoose.Types.ObjectId | string;
  sections: {
    name: string;
    code: string;
    capacity: number;
    teacher_id?: mongoose.Types.ObjectId | string;
    room?: string;
  }[];
  subjects: mongoose.Types.ObjectId[] | string[];
  start_date?: Date;
  end_date?: Date;
  is_active: boolean;
  settings: Record<string, any>;
}

const classSchema = createSchema({
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
  grade_level: {
    type: Number,
    required: true
  },
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  class_teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sections: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      default: 30
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    room: {
      type: String,
      trim: true
    }
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Apply standard indexes
applyStandardIndexes(classSchema);

// Additional compound indexes
classSchema.index({ tenant_id: 1, school_id: 1, code: 1, academic_year: 1 }, { unique: true });
classSchema.index({ tenant_id: 1, school_id: 1, grade_level: 1, academic_year: 1 });
classSchema.index({ class_teacher_id: 1 });
classSchema.index({ 'sections.teacher_id': 1 });

export default mongoose.models.Class || mongoose.model<IClass>('Class', classSchema);
