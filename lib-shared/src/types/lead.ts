import { z } from 'zod';

// Lead Status Enum
export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  ENGAGED = 'engaged',
  FOLLOW_UP = 'follow_up',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
  DISQUALIFIED = 'disqualified'
}

// Lead Source Enum
export enum LeadSource {
  WEBSITE = 'website',
  COLD_CALL = 'cold_call',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  TRADE_SHOW = 'trade_show',
  PARTNER = 'partner',
  OTHER = 'other'
}

// Lead Priority Enum
export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Lead Contact Information
export interface LeadContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  linkedinUrl?: string;
}

// Lead Property Information (Real Estate specific)
export interface LeadProperty {
  propertyType: 'residential' | 'commercial' | 'land' | 'investment';
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  features?: string[];
}

// Lead Qualification Score
export interface LeadQualification {
  score: number; // 0-100
  factors: {
    budget: number; // 0-10
    timeline: number; // 0-10
    motivation: number; // 0-10
    authority: number; // 0-10
    need: number; // 0-10
  };
  aiConfidence: number; // 0-1
  manualOverride?: boolean;
  notes?: string;
}

// Lead Engagement History
export interface LeadEngagement {
  id: string;
  timestamp: Date;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'note';
  content: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed';
  metadata?: Record<string, any>;
}

// Main Lead Entity
export interface Lead {
  id: string;
  contact: LeadContact;
  property?: LeadProperty;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  qualification: LeadQualification;
  assignedTo?: string; // User ID
  tags: string[];
  notes: string[];
  engagementHistory: LeadEngagement[];
  followUpSchedule: {
    nextFollowUp: Date;
    cadence: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    reminders: Date[];
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  dealValue?: number;
  conversionProbability: number; // 0-1
}

// Zod Schemas for Validation
export const LeadContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
});

export const LeadPropertySchema = z.object({
  propertyType: z.enum(['residential', 'commercial', 'land', 'investment']),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().length(3),
  }),
  location: z.object({
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    zipCode: z.string().optional(),
  }),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFootage: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
});

export const LeadQualificationSchema = z.object({
  score: z.number().min(0).max(100),
  factors: z.object({
    budget: z.number().min(0).max(10),
    timeline: z.number().min(0).max(10),
    motivation: z.number().min(0).max(10),
    authority: z.number().min(0).max(10),
    need: z.number().min(0).max(10),
  }),
  aiConfidence: z.number().min(0).max(1),
  manualOverride: z.boolean().optional(),
  notes: z.string().optional(),
});

export const LeadSchema = z.object({
  id: z.string().uuid(),
  contact: LeadContactSchema,
  property: LeadPropertySchema.optional(),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource),
  priority: z.nativeEnum(LeadPriority),
  qualification: LeadQualificationSchema,
  assignedTo: z.string().uuid().optional(),
  tags: z.array(z.string()),
  notes: z.array(z.string()),
  engagementHistory: z.array(z.any()), // Will be defined separately
  followUpSchedule: z.object({
    nextFollowUp: z.date(),
    cadence: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
    reminders: z.array(z.date()),
  }),
  metadata: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastContactedAt: z.date().optional(),
  expectedCloseDate: z.date().optional(),
  actualCloseDate: z.date().optional(),
  dealValue: z.number().min(0).optional(),
  conversionProbability: z.number().min(0).max(1),
});

// Type exports
export type LeadContactType = z.infer<typeof LeadContactSchema>;
export type LeadPropertyType = z.infer<typeof LeadPropertySchema>;
export type LeadQualificationType = z.infer<typeof LeadQualificationSchema>;
export type LeadType = z.infer<typeof LeadSchema>;
