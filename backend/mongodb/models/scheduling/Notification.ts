import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type NotificationPriorityType = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationStatusType = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
export type NotificationChannelType = 'in_app' | 'email' | 'sms' | 'push' | 'whatsapp' | 'all';

export interface INotification extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  title: string;
  message: string;
  notification_type: 'alert' | 'reminder' | 'announcement' | 'event' | 'task' | 'system' | 'other';
  priority: NotificationPriorityType;
  
  // Recipient information
  recipients: {
    all_users: boolean;
    specific_users: boolean;
    specific_roles: boolean;
    specific_classes: boolean;
    user_ids?: mongoose.Types.ObjectId[] | string[];
    role_ids?: mongoose.Types.ObjectId[] | string[];
    class_ids?: mongoose.Types.ObjectId[] | string[];
  };
  
  // Delivery information
  channels: NotificationChannelType[];
  scheduled_at: Date;
  expires_at?: Date;
  status: NotificationStatusType;
  
  // Response options
  requires_acknowledgment: boolean;
  acknowledgment_options?: string[]; // e.g., ["Yes", "No", "Maybe"]
  action_url?: string;
  action_text?: string;
  
  // Media content
  has_attachment: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
  
  // Rich content
  rich_content?: {
    html: string;
    images?: {
      url: string;
      alt?: string;
    }[];
  };
  
  // Metadata
  related_to?: {
    entity_type: string;
    entity_id: mongoose.Types.ObjectId | string;
  };
  
  // Delivery tracking
  delivery_attempts: number;
  last_attempt_at?: Date;
  delivery_logs?: {
    channel: NotificationChannelType;
    status: NotificationStatusType;
    attempted_at: Date;
    message_id?: string;
    error?: string;
  }[];
  
  // Receipt tracking
  receipt_status: {
    total_recipients: number;
    delivered_count: number;
    read_count: number;
    acknowledged_count: number;
    failed_count: number;
  };
  
  // System information
  template_id?: string;
  created_by: mongoose.Types.ObjectId | string;
  updated_by?: mongoose.Types.ObjectId | string;
}

const notificationSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  notification_type: {
    type: String,
    enum: ['alert', 'reminder', 'announcement', 'event', 'task', 'system', 'other'],
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    required: true,
    default: 'medium',
    index: true
  },
  
  // Recipient information
  recipients: {
    all_users: {
      type: Boolean,
      default: false
    },
    specific_users: {
      type: Boolean,
      default: false
    },
    specific_roles: {
      type: Boolean,
      default: false
    },
    specific_classes: {
      type: Boolean,
      default: false
    },
    user_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    role_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }],
    class_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }]
  },
  
  // Delivery information
  channels: [{
    type: String,
    enum: ['in_app', 'email', 'sms', 'push', 'whatsapp', 'all'],
    required: true
  }],
  scheduled_at: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  expires_at: {
    type: Date,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    required: true,
    default: 'pending',
    index: true
  },
  
  // Response options
  requires_acknowledgment: {
    type: Boolean,
    default: false
  },
  acknowledgment_options: [{
    type: String,
    trim: true
  }],
  action_url: {
    type: String
  },
  action_text: {
    type: String,
    trim: true
  },
  
  // Media content
  has_attachment: {
    type: Boolean,
    default: false
  },
  attachments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number
    }
  }],
  
  // Rich content
  rich_content: {
    html: {
      type: String
    },
    images: [{
      url: {
        type: String,
        required: true
      },
      alt: {
        type: String
      }
    }]
  },
  
  // Metadata
  related_to: {
    entity_type: {
      type: String,
      trim: true,
      index: true
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    }
  },
  
  // Delivery tracking
  delivery_attempts: {
    type: Number,
    default: 0
  },
  last_attempt_at: {
    type: Date
  },
  delivery_logs: [{
    channel: {
      type: String,
      enum: ['in_app', 'email', 'sms', 'push', 'whatsapp', 'all'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
      required: true
    },
    attempted_at: {
      type: Date,
      required: true,
      default: Date.now
    },
    message_id: {
      type: String
    },
    error: {
      type: String
    }
  }],
  
  // Receipt tracking
  receipt_status: {
    total_recipients: {
      type: Number,
      default: 0
    },
    delivered_count: {
      type: Number,
      default: 0
    },
    read_count: {
      type: Number,
      default: 0
    },
    acknowledged_count: {
      type: Number,
      default: 0
    },
    failed_count: {
      type: Number,
      default: 0
    }
  },
  
  // System information
  template_id: {
    type: String
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Apply standard indexes
applyStandardIndexes(notificationSchema);

// Additional compound indexes
notificationSchema.index({ tenant_id: 1, school_id: 1, status: 1, scheduled_at: 1 });
notificationSchema.index({ tenant_id: 1, 'recipients.user_ids': 1 });
notificationSchema.index({ tenant_id: 1, 'recipients.role_ids': 1 });
notificationSchema.index({ tenant_id: 1, 'recipients.class_ids': 1 });
notificationSchema.index({ tenant_id: 1, 'related_to.entity_type': 1, 'related_to.entity_id': 1 });
notificationSchema.index({ tenant_id: 1, notification_type: 1, priority: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
