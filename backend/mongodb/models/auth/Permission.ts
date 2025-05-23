import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IPermission extends BaseDocument {
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage' | 'approve' | 'reject' | 'assign';
  conditions?: Record<string, any>;
  is_system_permission: boolean;
}

const permissionSchema = createSchema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'manage', 'approve', 'reject', 'assign'],
    required: true
  },
  conditions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  is_system_permission: {
    type: Boolean,
    default: false
  }
});

// Apply standard indexes
applyStandardIndexes(permissionSchema);

// Additional compound indexes
permissionSchema.index({ tenant_id: 1, name: 1 }, { unique: true });
permissionSchema.index({ resource: 1, action: 1 });
permissionSchema.index({ is_system_permission: 1 });

export default mongoose.models.Permission || mongoose.model<IPermission>('Permission', permissionSchema);
