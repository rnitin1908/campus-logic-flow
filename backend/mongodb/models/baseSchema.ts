import mongoose, { Document, Schema } from 'mongoose';

// Base interface for all documents that support multi-tenancy
export interface BaseDocument extends Document {
  tenant_id: mongoose.Types.ObjectId | string;
  created_at: Date;
  updated_at: Date;
  created_by?: mongoose.Types.ObjectId | string;
  updated_by?: mongoose.Types.ObjectId | string;
  is_active: boolean;
  is_deleted: boolean;
  metadata?: Record<string, any>;
}

// Reusable schema fields for multi-tenancy and auditing
export const baseSchemaFields = {
  tenant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  is_deleted: {
    type: Boolean,
    default: false,
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
};

// Create a base schema with common fields
export const baseSchemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { 
    virtuals: true,
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
};

// Helper function to create a new schema with base fields
export function createSchema(fields: Record<string, any>, options = {}) {
  return new Schema({
    ...baseSchemaFields,
    ...fields
  }, {
    ...baseSchemaOptions,
    ...options
  });
}

// Apply standard indexes to a schema for multi-tenant queries
export function applyStandardIndexes(schema: Schema) {
  // Compound index for tenant-specific queries with active status
  schema.index({ tenant_id: 1, is_active: 1, is_deleted: 1 });
  
  // Compound index for tenant-specific queries with created date
  schema.index({ tenant_id: 1, created_at: -1 });
  
  return schema;
}
