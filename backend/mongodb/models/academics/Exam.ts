import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type ExamType = 'quiz' | 'test' | 'midterm' | 'final' | 'unit_test' | 'practical' | 'oral' | 'project';

export interface IExam extends BaseDocument {
  title: string;
  description?: string;
  school_id: mongoose.Types.ObjectId | string;
  academic_year: string;
  exam_type: ExamType;
  subject_id: mongoose.Types.ObjectId | string;
  class_id: mongoose.Types.ObjectId | string;
  teacher_id: mongoose.Types.ObjectId | string;
  start_date: Date;
  end_date: Date;
  duration: number; // in minutes
  total_marks: number;
  passing_marks: number;
  instructions?: string;
  venue?: string;
  sections?: {
    name: string;
    question_type: 'multiple_choice' | 'descriptive' | 'true_false' | 'fill_in_blanks' | 'match_the_following';
    marks_per_question: number;
    number_of_questions: number;
    total_marks: number;
  }[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  result_published: boolean;
  result_publish_date?: Date;
  syllabus_topics?: string[];
  created_by: mongoose.Types.ObjectId | string;
}

const examSchema = createSchema({
  title: {
    type: String,
    required: true,
    trim: true
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
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  exam_type: {
    type: String,
    enum: ['quiz', 'test', 'midterm', 'final', 'unit_test', 'practical', 'oral', 'project'],
    required: true,
    index: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    index: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  start_date: {
    type: Date,
    required: true,
    index: true
  },
  end_date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  total_marks: {
    type: Number,
    required: true
  },
  passing_marks: {
    type: Number,
    required: true
  },
  instructions: {
    type: String
  },
  venue: {
    type: String,
    trim: true
  },
  sections: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    question_type: {
      type: String,
      enum: ['multiple_choice', 'descriptive', 'true_false', 'fill_in_blanks', 'match_the_following'],
      required: true
    },
    marks_per_question: {
      type: Number,
      required: true
    },
    number_of_questions: {
      type: Number,
      required: true
    },
    total_marks: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'postponed'],
    required: true,
    default: 'scheduled',
    index: true
  },
  result_published: {
    type: Boolean,
    default: false,
    index: true
  },
  result_publish_date: {
    type: Date
  },
  syllabus_topics: [{
    type: String,
    trim: true
  }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
});

// Apply standard indexes
applyStandardIndexes(examSchema);

// Additional compound indexes
examSchema.index({ tenant_id: 1, school_id: 1, academic_year: 1, exam_type: 1 });
examSchema.index({ tenant_id: 1, class_id: 1, subject_id: 1 });
examSchema.index({ tenant_id: 1, start_date: 1, status: 1 });

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', examSchema);
