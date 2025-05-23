import mongoose, { Document, Schema } from 'mongoose';

export type GenderType = 'male' | 'female' | 'other';
export type StatusType = 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';

export interface IStudent extends Document {
  name: string;
  email: string;
  roll_number: string;
  department: string;
  status: StatusType;
  date_of_birth?: string;
  gender?: GenderType;
  contact_number?: string;
  address?: string;
  class?: string;
  section?: string;
  academic_year?: string;
  admission_date?: string;
  previous_school?: string;
  profile_id: string;
  created_at: Date;
  updated_at: Date;
  enrollment_date?: string;
}

const StudentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  roll_number: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'transferred', 'suspended'],
    default: 'active'
  },
  date_of_birth: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  contact_number: {
    type: String
  },
  address: {
    type: String
  },
  class: {
    type: String
  },
  section: {
    type: String
  },
  academic_year: {
    type: String
  },
  admission_date: {
    type: String
  },
  previous_school: {
    type: String
  },
  profile_id: {
    type: String,
    ref: 'Profile',
    required: true
  },
  enrollment_date: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
