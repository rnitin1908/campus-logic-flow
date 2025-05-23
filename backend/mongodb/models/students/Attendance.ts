import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type AttendanceStatusType = 'present' | 'absent' | 'late' | 'half_day' | 'excused' | 'leave';

export interface IAttendance extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  class_id: mongoose.Types.ObjectId | string;
  section?: string;
  subject_id?: mongoose.Types.ObjectId | string;
  date: Date;
  academic_year: string;
  term_id?: mongoose.Types.ObjectId | string;
  period?: number;
  teacher_id: mongoose.Types.ObjectId | string;
  attendance_records: {
    student_id: mongoose.Types.ObjectId | string;
    status: AttendanceStatusType;
    remarks?: string;
    late_minutes?: number;
    updated_by?: mongoose.Types.ObjectId | string;
    updated_at?: Date;
  }[];
  is_finalized: boolean;
  finalized_at?: Date;
  finalized_by?: mongoose.Types.ObjectId | string;
  attendance_type: 'daily' | 'subject_wise';
}

const attendanceSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
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
    ref: 'Subject'
  },
  date: {
    type: Date,
    required: true,
    index: true
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
  period: {
    type: Number
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  attendance_records: [{
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half_day', 'excused', 'leave'],
      required: true,
      default: 'present'
    },
    remarks: {
      type: String
    },
    late_minutes: {
      type: Number
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  }],
  is_finalized: {
    type: Boolean,
    default: false,
    index: true
  },
  finalized_at: {
    type: Date
  },
  finalized_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendance_type: {
    type: String,
    enum: ['daily', 'subject_wise'],
    required: true,
    default: 'daily'
  }
});

// Apply standard indexes
applyStandardIndexes(attendanceSchema);

// Additional compound indexes
attendanceSchema.index({ tenant_id: 1, class_id: 1, section: 1, date: 1, attendance_type: 1 });
attendanceSchema.index({ tenant_id: 1, class_id: 1, subject_id: 1, date: 1 });
attendanceSchema.index({ tenant_id: 1, teacher_id: 1, date: 1 });
attendanceSchema.index({ 'attendance_records.student_id': 1 });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', attendanceSchema);
