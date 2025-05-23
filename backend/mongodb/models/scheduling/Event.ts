import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type EventVisibilityType = 'public' | 'school' | 'class' | 'private';
export type EventStatusType = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
export type EventRecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface IEvent extends BaseDocument {
  school_id: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  event_type: 'academic' | 'sports' | 'cultural' | 'holiday' | 'exam' | 'meeting' | 'other';
  start_date: Date;
  start_time: string;
  end_date: Date;
  end_time: string;
  is_all_day: boolean;
  location?: string;
  visibility: EventVisibilityType;
  status: EventStatusType;
  color?: string;
  
  // Audience targeting
  target_audience: {
    all_school: boolean;
    specific_classes: boolean;
    specific_users: boolean;
    class_ids?: mongoose.Types.ObjectId[] | string[];
    grade_levels?: number[];
    user_ids?: mongoose.Types.ObjectId[] | string[];
    user_roles?: string[];
  };
  
  // Recurrence
  is_recurring: boolean;
  recurrence?: {
    type: EventRecurrenceType;
    interval: number;
    end_date?: Date;
    end_after_occurrences?: number;
    days_of_week?: number[];
    day_of_month?: number;
    month_of_year?: number;
    exceptions?: Date[];
  };
  
  // Attachments and resources
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
    uploaded_at: Date;
  }[];
  
  // Organization
  organizer_id: mongoose.Types.ObjectId | string;
  organizer_name: string;
  co_organizers?: {
    user_id: mongoose.Types.ObjectId | string;
    name: string;
    role: string;
  }[];
  
  // RSVP and participation
  requires_registration: boolean;
  max_participants?: number;
  registration_deadline?: Date;
  participants?: {
    user_id: mongoose.Types.ObjectId | string;
    name: string;
    status: 'registered' | 'attended' | 'absent' | 'cancelled';
    registration_date: Date;
  }[];
  
  // Notifications
  reminder_before?: number; // minutes
  send_notifications: boolean;
  notification_sent?: boolean;
  
  // Additional
  parent_event_id?: mongoose.Types.ObjectId | string;
  external_calendar_id?: string;
  created_by: mongoose.Types.ObjectId | string;
  updated_by?: mongoose.Types.ObjectId | string;
}

const eventSchema = createSchema({
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
  description: {
    type: String,
    trim: true
  },
  event_type: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'],
    required: true,
    index: true
  },
  start_date: {
    type: Date,
    required: true,
    index: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_date: {
    type: Date,
    required: true,
    index: true
  },
  end_time: {
    type: String,
    required: true
  },
  is_all_day: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  visibility: {
    type: String,
    enum: ['public', 'school', 'class', 'private'],
    required: true,
    default: 'school',
    index: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'],
    required: true,
    default: 'scheduled',
    index: true
  },
  color: {
    type: String
  },
  
  // Audience targeting
  target_audience: {
    all_school: {
      type: Boolean,
      default: false
    },
    specific_classes: {
      type: Boolean,
      default: false
    },
    specific_users: {
      type: Boolean,
      default: false
    },
    class_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }],
    grade_levels: [{
      type: Number
    }],
    user_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    user_roles: [{
      type: String,
      trim: true
    }]
  },
  
  // Recurrence
  is_recurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    type: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'],
      default: 'none'
    },
    interval: {
      type: Number,
      default: 1
    },
    end_date: {
      type: Date
    },
    end_after_occurrences: {
      type: Number
    },
    days_of_week: [{
      type: Number,
      min: 0,
      max: 6
    }],
    day_of_month: {
      type: Number,
      min: 1,
      max: 31
    },
    month_of_year: {
      type: Number,
      min: 1,
      max: 12
    },
    exceptions: [{
      type: Date
    }]
  },
  
  // Attachments and resources
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
      required: true,
      trim: true
    },
    size: {
      type: Number
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Organization
  organizer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  organizer_name: {
    type: String,
    required: true,
    trim: true
  },
  co_organizers: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    }
  }],
  
  // RSVP and participation
  requires_registration: {
    type: Boolean,
    default: false
  },
  max_participants: {
    type: Number
  },
  registration_deadline: {
    type: Date
  },
  participants: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'absent', 'cancelled'],
      required: true,
      default: 'registered'
    },
    registration_date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Notifications
  reminder_before: {
    type: Number
  },
  send_notifications: {
    type: Boolean,
    default: true
  },
  notification_sent: {
    type: Boolean,
    default: false
  },
  
  // Additional
  parent_event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  external_calendar_id: {
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
applyStandardIndexes(eventSchema);

// Additional compound indexes
eventSchema.index({ tenant_id: 1, school_id: 1, start_date: 1, end_date: 1 });
eventSchema.index({ tenant_id: 1, school_id: 1, event_type: 1 });
eventSchema.index({ tenant_id: 1, 'target_audience.class_ids': 1 });
eventSchema.index({ tenant_id: 1, 'target_audience.user_ids': 1 });
eventSchema.index({ tenant_id: 1, 'participants.user_id': 1 });
eventSchema.index({ tenant_id: 1, parent_event_id: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
