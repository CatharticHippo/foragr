import { z } from 'zod';
import { LocationSchema } from './common';

// Attendance schema
export const AttendanceSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  userId: z.string().uuid(),
  shiftId: z.string().uuid(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  checkInLocation: LocationSchema.optional(),
  checkOutLocation: LocationSchema.optional(),
  supervisorVerified: z.boolean(),
  supervisorId: z.string().uuid().optional(),
  hoursWorked: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  shift: z.object({
    id: z.string().uuid(),
    title: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    listing: z.object({
      id: z.string().uuid(),
      title: z.string(),
      organization: z.object({
        id: z.string().uuid(),
        name: z.string(),
      }),
    }),
  }).optional(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;

// Check-in request schema
export const CheckInRequestSchema = z.object({
  applicationId: z.string().uuid(),
  qrCode: z.string().optional(),
  supervisorPin: z.string().optional(),
  location: LocationSchema.optional(),
  notes: z.string().optional(),
});

export type CheckInRequest = z.infer<typeof CheckInRequestSchema>;

// Check-out request schema
export const CheckOutRequestSchema = z.object({
  attendanceId: z.string().uuid(),
  location: LocationSchema.optional(),
  notes: z.string().optional(),
});

export type CheckOutRequest = z.infer<typeof CheckOutRequestSchema>;

// QR code generation request schema
export const GenerateQRCodeRequestSchema = z.object({
  shiftId: z.string().uuid(),
  expiresIn: z.number().optional(), // in minutes, default 30
});

export type GenerateQRCodeRequest = z.infer<typeof GenerateQRCodeRequestSchema>;

// QR code response schema
export const QRCodeResponseSchema = z.object({
  qrCode: z.string(),
  expiresAt: z.string(),
});

export type QRCodeResponse = z.infer<typeof QRCodeResponseSchema>;
