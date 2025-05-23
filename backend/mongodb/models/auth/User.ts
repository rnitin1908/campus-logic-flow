import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

// User roles enum
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ACCOUNTANT: 'accountant',
  LIBRARIAN: 'librarian',
  RECEPTIONIST: 'receptionist',
  TRANSPORT_MANAGER: 'transport_manager'
};

export interface IUser extends BaseDocument {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  full_name: string;
  mobile: string;
  profile_image?: string;
  role: string;
  roles: mongoose.Types.ObjectId[] | string[];
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  last_login?: Date;
  failed_login_attempts: number;
  locked_until?: Date;
  password_reset_token?: string;
  password_reset_expires?: Date;
  verification_token?: string;
  verification_expires?: Date;
  preferences?: Record<string, any>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = createSchema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  profile_image: {
    type: String
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT,
    index: true
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  is_email_verified: {
    type: Boolean,
    default: false
  },
  is_mobile_verified: {
    type: Boolean,
    default: false
  },
  last_login: {
    type: Date
  },
  failed_login_attempts: {
    type: Number,
    default: 0
  },
  locked_until: {
    type: Date
  },
  password_reset_token: String,
  password_reset_expires: Date,
  verification_token: String,
  verification_expires: Date,
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Create a virtual for the full name
userSchema.virtual('name').get(function(this: IUser) {
  return `${this.first_name} ${this.last_name}`;
});

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Update full_name
    this.full_name = `${this.first_name} ${this.last_name}`;
    
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Apply standard indexes
applyStandardIndexes(userSchema);

// Additional compound indexes
userSchema.index({ tenant_id: 1, email: 1 }, { unique: true });
userSchema.index({ tenant_id: 1, mobile: 1 });
userSchema.index({ verification_token: 1 });
userSchema.index({ password_reset_token: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
