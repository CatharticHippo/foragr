import { z } from 'zod';

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

export function validateUuid(uuid: string): boolean {
  const uuidSchema = z.string().uuid();
  return uuidSchema.safeParse(uuid).success;
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/);
  return phoneSchema.safeParse(phone).success;
}
