import { z } from 'zod';
import { LeadStatus, LeadSource, LeadPriority } from '../types/lead';

// Base Event Interface
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: Date;
  version: string;
  correlationId?: string;
  causationId?: string;
  metadata?: Record<string, any>;
}

// Lead Created Event
export interface LeadCreatedEvent extends BaseEvent {
  type: 'LeadCreated';
  data: {
    leadId: string;
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      company?: string;
    };
    source: LeadSource;
    initialTags: string[];
    metadata: Record<string, any>;
  };
}

// Lead Qualified Event
export interface LeadQualifiedEvent extends BaseEvent {
  type: 'LeadQualified';
  data: {
    leadId: string;
    qualificationScore: number;
    aiConfidence: number;
    factors: {
      budget: number;
      timeline: number;
      motivation: number;
      authority: number;
      need: number;
    };
    nextStage: LeadStatus;
    assignedTo?: string;
    notes?: string;
  };
}

// Lead Engaged Event
export interface LeadEngagedEvent extends BaseEvent {
  type: 'LeadEngaged';
  data: {
    leadId: string;
    engagementType: 'email' | 'sms' | 'call' | 'meeting';
    content: string;
    responseReceived: boolean;
    responseTime?: number; // milliseconds
    nextFollowUpDate: Date;
    cadence: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  };
}

// Follow-up Triggered Event
export interface FollowUpTriggeredEvent extends BaseEvent {
  type: 'FollowUpTriggered';
  data: {
    leadId: string;
    followUpType: 'reminder' | 'escalation' | 'sla_breach';
    scheduledDate: Date;
    priority: LeadPriority;
    assignedTo: string;
    templateId?: string;
    customMessage?: string;
  };
}

// Lead Status Changed Event
export interface LeadStatusChangedEvent extends BaseEvent {
  type: 'LeadStatusChanged';
  data: {
    leadId: string;
    previousStatus: LeadStatus;
    newStatus: LeadStatus;
    reason?: string;
    changedBy: string;
    metadata?: Record<string, any>;
  };
}

// Deal Closed Event
export interface DealClosedEvent extends BaseEvent {
  type: 'DealClosed';
  data: {
    leadId: string;
    outcome: 'won' | 'lost';
    dealValue?: number;
    closeReason?: string;
    closedBy: string;
    conversionTime: number; // days from lead creation
    totalEngagements: number;
    finalNotes?: string;
  };
}

// Lead Disqualified Event
export interface LeadDisqualifiedEvent extends BaseEvent {
  type: 'LeadDisqualified';
  data: {
    leadId: string;
    reason: string;
    disqualifiedBy: string;
    qualificationScore: number;
    aiConfidence: number;
    notes?: string;
  };
}

// Zod Schemas for Event Validation
export const BaseEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  timestamp: z.date(),
  version: z.string(),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export const LeadCreatedEventSchema = BaseEventSchema.extend({
  type: z.literal('LeadCreated'),
  data: z.object({
    leadId: z.string().uuid(),
    contact: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
    }),
    source: z.nativeEnum(LeadSource),
    initialTags: z.array(z.string()),
    metadata: z.record(z.any()),
  }),
});

export const LeadQualifiedEventSchema = BaseEventSchema.extend({
  type: z.literal('LeadQualified'),
  data: z.object({
    leadId: z.string().uuid(),
    qualificationScore: z.number().min(0).max(100),
    aiConfidence: z.number().min(0).max(1),
    factors: z.object({
      budget: z.number().min(0).max(10),
      timeline: z.number().min(0).max(10),
      motivation: z.number().min(0).max(10),
      authority: z.number().min(0).max(10),
      need: z.number().min(0).max(10),
    }),
    nextStage: z.nativeEnum(LeadStatus),
    assignedTo: z.string().uuid().optional(),
    notes: z.string().optional(),
  }),
});

export const LeadEngagedEventSchema = BaseEventSchema.extend({
  type: z.literal('LeadEngaged'),
  data: z.object({
    leadId: z.string().uuid(),
    engagementType: z.enum(['email', 'sms', 'call', 'meeting']),
    content: z.string(),
    responseReceived: z.boolean(),
    responseTime: z.number().min(0).optional(),
    nextFollowUpDate: z.date(),
    cadence: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
  }),
});

export const FollowUpTriggeredEventSchema = BaseEventSchema.extend({
  type: z.literal('FollowUpTriggered'),
  data: z.object({
    leadId: z.string().uuid(),
    followUpType: z.enum(['reminder', 'escalation', 'sla_breach']),
    scheduledDate: z.date(),
    priority: z.nativeEnum(LeadPriority),
    assignedTo: z.string().uuid(),
    templateId: z.string().optional(),
    customMessage: z.string().optional(),
  }),
});

export const LeadStatusChangedEventSchema = BaseEventSchema.extend({
  type: z.literal('LeadStatusChanged'),
  data: z.object({
    leadId: z.string().uuid(),
    previousStatus: z.nativeEnum(LeadStatus),
    newStatus: z.nativeEnum(LeadStatus),
    reason: z.string().optional(),
    changedBy: z.string().uuid(),
    metadata: z.record(z.any()).optional(),
  }),
});

export const DealClosedEventSchema = BaseEventSchema.extend({
  type: z.literal('DealClosed'),
  data: z.object({
    leadId: z.string().uuid(),
    outcome: z.enum(['won', 'lost']),
    dealValue: z.number().min(0).optional(),
    closeReason: z.string().optional(),
    closedBy: z.string().uuid(),
    conversionTime: z.number().min(0),
    totalEngagements: z.number().min(0),
    finalNotes: z.string().optional(),
  }),
});

export const LeadDisqualifiedEventSchema = BaseEventSchema.extend({
  type: z.literal('LeadDisqualified'),
  data: z.object({
    leadId: z.string().uuid(),
    reason: z.string(),
    disqualifiedBy: z.string().uuid(),
    qualificationScore: z.number().min(0).max(100),
    aiConfidence: z.number().min(0).max(1),
    notes: z.string().optional(),
  }),
});

// Union type for all lead events
export const LeadEventSchema = z.union([
  LeadCreatedEventSchema,
  LeadQualifiedEventSchema,
  LeadEngagedEventSchema,
  FollowUpTriggeredEventSchema,
  LeadStatusChangedEventSchema,
  DealClosedEventSchema,
  LeadDisqualifiedEventSchema,
]);

// Event type mapping
export type LeadEvent = z.infer<typeof LeadEventSchema>;
export type LeadEventType = LeadEvent['type'];

// Event factory functions
export const createLeadCreatedEvent = (data: LeadCreatedEvent['data']): LeadCreatedEvent => ({
  id: crypto.randomUUID(),
  type: 'LeadCreated',
  timestamp: new Date(),
  version: '1.0.0',
  data,
});

export const createLeadQualifiedEvent = (data: LeadQualifiedEvent['data']): LeadQualifiedEvent => ({
  id: crypto.randomUUID(),
  type: 'LeadQualified',
  timestamp: new Date(),
  version: '1.0.0',
  data,
});

export const createLeadEngagedEvent = (data: LeadEngagedEvent['data']): LeadEngagedEvent => ({
  id: crypto.randomUUID(),
  type: 'LeadEngaged',
  timestamp: new Date(),
  version: '1.0.0',
  data,
});

export const createFollowUpTriggeredEvent = (data: FollowUpTriggeredEvent['data']): FollowUpTriggeredEvent => ({
  id: crypto.randomUUID(),
  type: 'FollowUpTriggered',
  timestamp: new Date(),
  version: '1.0.0',
  data,
});

export const createLeadStatusChangedEvent = (data: LeadStatusChangedEvent['data']): LeadStatusChangedEvent => ({
  id: crypto.randomUUID(),
  type: 'LeadStatusChanged',
  timestamp: new Date(),
  version: '1.0.0',
  data,
});

export const createDealClosedEvent = (data: DealClosedEvent['data']): DealClosedEvent => ({
  id: crypto.randomUUID(),
  type: 'DealClosed',
  timestamp: new Date(),
  version: '1.0.0',
  data,
});

export const createLeadDisqualifiedEvent = (data: LeadDisqualifiedEvent['data']): LeadDisqualifiedEvent => ({
  id: crypto.randomUUID(),
  type: 'LeadDisqualified',
  timestamp: new Date(),
  version: '1.0.0',
  data,
});
