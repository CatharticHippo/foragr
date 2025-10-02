import { z } from 'zod';
import { LocationSchema } from './common';

// Listing type enum
export const ListingTypeSchema = z.enum(['volunteer_shift', 'cash_campaign']);
export type ListingType = z.infer<typeof ListingTypeSchema>;

// Listing schema
export const ListingSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  listingType: ListingTypeSchema,
  location: LocationSchema.optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
  maxParticipants: z.number().optional(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  requiredSkills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  organization: z.object({
    id: z.string().uuid(),
    name: z.string(),
    logoUrl: z.string().url().optional(),
  }).optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

// Shift schema (for volunteer shifts)
export const ShiftSchema = z.object({
  id: z.string().uuid(),
  listingId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  maxVolunteers: z.number().optional(),
  supervisorName: z.string().optional(),
  supervisorPhone: z.string().optional(),
  supervisorEmail: z.string().optional(),
  checkInInstructions: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Shift = z.infer<typeof ShiftSchema>;

// Create listing request schema
export const CreateListingRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  listingType: ListingTypeSchema,
  location: LocationSchema.optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
  maxParticipants: z.number().optional(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  requiredSkills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateListingRequest = z.infer<typeof CreateListingRequestSchema>;

// Update listing request schema
export const UpdateListingRequestSchema = CreateListingRequestSchema.partial();

export type UpdateListingRequest = z.infer<typeof UpdateListingRequestSchema>;
