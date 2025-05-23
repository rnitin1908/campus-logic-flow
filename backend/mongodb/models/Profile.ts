import mongoose, { Document, Schema } from 'mongoose';
import { USER_ROLES } from './User';

export interface IProfile extends Document {
  id: string;
  name: string;
  email: string;
  role: string;
  school_id?: string;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
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
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT
  },
  school_id: {
    type: String,
    ref: 'School',
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
