import { z } from 'zod';
import { LocationSchema } from './common';

// Organization status enum
export const OrganizationStatusSchema = z.enum(['pending', 'approved', 'rejected', 'suspended']);
export type OrganizationStatus = z.infer<typeof OrganizationStatusSchema>;

// Organization schema
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  ein: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  location: LocationSchema.optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  status: OrganizationStatusSchema,
  stripeAccountId: z.string().optional(),
  stripeAccountVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Organization = z.infer<typeof OrganizationSchema>;

// Organization admin schema
export const OrganizationAdminSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.string(),
  isPrimary: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }).optional(),
});

export type OrganizationAdmin = z.infer<typeof OrganizationAdminSchema>;

// Create organization request schema
export const CreateOrganizationRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ein: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  location: LocationSchema.optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;

// Update organization request schema
export const UpdateOrganizationRequestSchema = CreateOrganizationRequestSchema.partial();

export type UpdateOrganizationRequest = z.infer<typeof UpdateOrganizationRequestSchema>;

// Organization stats schema
export const OrganizationStatsSchema = z.object({
  organizationId: z.string().uuid(),
  organizationName: z.string(),
  logoUrl: z.string().url().optional(),
  totalListings: z.number(),
  activeListings: z.number(),
  totalApplications: z.number(),
  acceptedApplications: z.number(),
  totalDonations: z.number(),
  totalDonationsCents: z.number(),
  totalAttendanceRecords: z.number(),
  totalVolunteerHours: z.number(),
});

export type OrganizationStats = z.infer<typeof OrganizationStatsSchema>;
