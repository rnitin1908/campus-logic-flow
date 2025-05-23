import mongoose, { Document, Schema } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  principal_name?: string;
  established_year?: number;
  created_at: Date;
  updated_at: Date;
}

const SchoolSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  zip_code: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  website: {
    type: String
  },
  principal_name: {
    type: String
  },
  established_year: {
    type: Number
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
