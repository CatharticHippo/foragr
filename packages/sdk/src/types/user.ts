import { z } from 'zod';

// User stats schema
export const UserStatsSchema = z.object({
  totalXp: z.number(),
  totalHours: z.number(),
  totalDonations: z.number(),
  badgeCount: z.number(),
  level: z.number(),
});

export type UserStats = z.infer<typeof UserStatsSchema>;

// User badge schema
export const UserBadgeSchema = z.object({
  id: z.string().uuid(),
  earnedAt: z.string(),
  badge: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    iconUrl: z.string().url().optional(),
    category: z.string().optional(),
  }),
});

export type UserBadge = z.infer<typeof UserBadgeSchema>;

// XP event schema
export const XpEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  xpAmount: z.number(),
  description: z.string(),
  referenceId: z.string().uuid().optional(),
  referenceType: z.string().optional(),
  createdAt: z.string(),
});

export type XpEvent = z.infer<typeof XpEventSchema>;

// Update user request schema
export const UpdateUserRequestSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
