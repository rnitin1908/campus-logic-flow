import mongoose, { Document, Schema } from 'mongoose';
import { GenderType } from './Student';

export type AdmissionStatusType = 'pending' | 'approved' | 'rejected' | 'waitlisted';

export interface IAdmissionRequest extends Document {
  academic_year: string;
  address?: string;
  contact_number?: string;
  date_of_birth?: string;
  email?: string;
  gender?: GenderType;
  grade_applying_for: string;
  notes?: string;
  parent_id: string;
  previous_school?: string;
  school_id?: string;
  status: AdmissionStatusType;
  student_name: string;
  created_at: Date;
  updated_at: Date;
}

const AdmissionRequestSchema: Schema = new Schema({
  academic_year: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  contact_number: {
    type: String
  },
  date_of_birth: {
    type: String
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  grade_applying_for: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  parent_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  previous_school: {
    type: String
  },
  school_id: {
    type: String,
    ref: 'School'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'waitlisted'],
    default: 'pending'
  },
  student_name: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.AdmissionRequest || mongoose.model<IAdmissionRequest>('AdmissionRequest', AdmissionRequestSchema);
