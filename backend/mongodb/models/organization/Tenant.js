const mongoose = require('mongoose');

/**
 * Tenant Schema
 * Represents a tenant organization in a multi-tenant system
 */
const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  domain: {
    type: String,
    trim: true,
    lowercase: true
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    start_date: {
      type: Date,
      default: Date.now
    },
    end_date: {
      type: Date
    }
  },
  settings: {
    theme: {
      type: String,
      default: 'default'
    },
    logo: {
      type: String
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    locale: {
      type: String,
      default: 'en'
    }
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
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
  }
});

// Pre-save middleware to update timestamps
tenantSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
