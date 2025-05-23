import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IAuditLog extends BaseDocument {
  user_id: mongoose.Types.ObjectId | string;
  action: string;
  resource: string;
  resource_id?: mongoose.Types.ObjectId | string;
  description: string;
  previous_state?: Record<string, any>;
  new_state?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
}

const auditLogSchema = createSchema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  resource: {
    type: String,
    required: true,
    index: true
  },
  resource_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  previous_state: {
    type: mongoose.Schema.Types.Mixed
  },
  new_state: {
    type: mongoose.Schema.Types.Mixed
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  success: {
    type: Boolean,
    default: true,
    index: true
  },
  error_message: {
    type: String
  }
});

// Apply standard indexes
applyStandardIndexes(auditLogSchema);

// Additional compound indexes
auditLogSchema.index({ tenant_id: 1, created_at: -1 });
auditLogSchema.index({ tenant_id: 1, resource: 1, action: 1 });
auditLogSchema.index({ tenant_id: 1, resource: 1, resource_id: 1 });
auditLogSchema.index({ tenant_id: 1, user_id: 1, created_at: -1 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
