import { z } from 'zod';

// Application status enum
export const ApplicationStatusSchema = z.enum(['new', 'review', 'accepted', 'scheduled', 'completed', 'cancelled']);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

// Application schema
export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  listingId: z.string().uuid(),
  shiftId: z.string().uuid().optional(),
  status: ApplicationStatusSchema,
  applicationText: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  notes: z.string().optional(),
  appliedAt: z.string(),
  reviewedAt: z.string().optional(),
  reviewedBy: z.string().uuid().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  listing: z.object({
    id: z.string().uuid(),
    title: z.string(),
    listingType: z.string(),
    organization: z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
  }).optional(),
  shift: z.object({
    id: z.string().uuid(),
    title: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  }).optional(),
});

export type Application = z.infer<typeof ApplicationSchema>;

// Create application request schema
export const CreateApplicationRequestSchema = z.object({
  listingId: z.string().uuid(),
  shiftId: z.string().uuid().optional(),
  applicationText: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export type CreateApplicationRequest = z.infer<typeof CreateApplicationRequestSchema>;

// Update application request schema
export const UpdateApplicationRequestSchema = z.object({
  status: ApplicationStatusSchema.optional(),
  applicationText: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateApplicationRequest = z.infer<typeof UpdateApplicationRequestSchema>;
