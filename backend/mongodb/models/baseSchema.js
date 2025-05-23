const mongoose = require('mongoose');

// Base schema fields that will be included in all models for consistency
const baseSchemaFields = {
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  is_deleted: {
    type: Boolean,
    default: false,
    index: true
  }
};

// Function to create schema with base fields
function createSchema(schemaFields) {
  const schema = new mongoose.Schema({
    ...baseSchemaFields,
    ...schemaFields
  }, {
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at'
    },
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  });

  // Add a pre-save middleware to automatically update the updated_at field
  schema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

  // Add a pre-findOneAndUpdate middleware to automatically update the updated_at field
  schema.pre('findOneAndUpdate', function(next) {
    this.set({ updated_at: new Date() });
    next();
  });

  return schema;
}

// Apply standard indexes to all schemas
function applyStandardIndexes(schema) {
  // Add compound index for tenant filtering with deletion check
  schema.index({ tenant_id: 1, is_deleted: 1 });
  
  // Add index for created_at and updated_at for sorting
  schema.index({ created_at: 1 });
  schema.index({ updated_at: 1 });
}

module.exports = {
  baseSchemaFields,
  createSchema,
  applyStandardIndexes
};
