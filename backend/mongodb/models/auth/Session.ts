import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export interface ISession extends BaseDocument {
  user_id: mongoose.Types.ObjectId | string;
  token: string;
  ip_address?: string;
  user_agent?: string;
  device_info?: Record<string, any>;
  expires_at: Date;
  is_revoked: boolean;
  revoked_at?: Date;
  revoked_reason?: string;
  last_activity: Date;
}

const sessionSchema = createSchema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    index: true
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  device_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  expires_at: {
    type: Date,
    required: true,
    index: true
  },
  is_revoked: {
    type: Boolean,
    default: false,
    index: true
  },
  revoked_at: {
    type: Date
  },
  revoked_reason: {
    type: String
  },
  last_activity: {
    type: Date,
    default: Date.now
  }
});

// Apply standard indexes
applyStandardIndexes(sessionSchema);

// Additional compound indexes
sessionSchema.index({ user_id: 1, is_revoked: 1 });
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
