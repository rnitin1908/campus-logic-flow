const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createSchema, applyStandardIndexes } = require('../baseSchema');

// Define allowed user roles matching what was in supabaseService.ts
const USER_ROLES = {
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

const userSchema = createSchema({
  name: {
    type: String,
    required: true,
    trim: true
  },
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
    required: true
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  profile_image: {
    type: String
  },
  last_login: {
    type: Date
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  account_status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'inactive'],
    default: 'active',
    index: true
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    index: true
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  permissions: [{
    type: String,
    trim: true
  }],
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      app: {
        type: Boolean,
        default: true
      }
    }
  },
  reset_password_token: String,
  reset_password_expires: Date
});

// Apply standard indexes
applyStandardIndexes(userSchema);

// Additional compound indexes
userSchema.index({ tenant_id: 1, role: 1, account_status: 1 });
userSchema.index({ tenant_id: 1, school_id: 1, role: 1 });

// Pre-save middleware to hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  // Only hash the password if it's modified or new
  if (!user.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    const hash = await bcrypt.hash(user.password, salt);
    // Replace plaintext password with hashed password
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Create a virtual field for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Create a JSON representation of user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.reset_password_token;
  delete user.reset_password_expires;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  USER_ROLES
};
