import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface IRole extends BaseDocument {
  name: string;
  description: string;
  permissions: mongoose.Types.ObjectId[] | string[];
  is_system_role: boolean;
  scope: 'global' | 'tenant' | 'school' | 'department';
}

const roleSchema = createSchema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  is_system_role: {
    type: Boolean,
    default: false
  },
  scope: {
    type: String,
    enum: ['global', 'tenant', 'school', 'department'],
    default: 'tenant'
  }
});

// Apply standard indexes
applyStandardIndexes(roleSchema);

// Additional compound indexes
roleSchema.index({ tenant_id: 1, name: 1 }, { unique: true });
roleSchema.index({ is_system_role: 1 });

export default mongoose.models.Role || mongoose.model<IRole>('Role', roleSchema);
