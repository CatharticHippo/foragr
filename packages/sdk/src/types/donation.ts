import { z } from 'zod';

// Donation method enum
export const DonationMethodSchema = z.enum(['stripe', 'apple_pay', 'google_pay']);
export type DonationMethod = z.infer<typeof DonationMethodSchema>;

// Donation schema
export const DonationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  listingId: z.string().uuid().optional(),
  amountCents: z.number(),
  currency: z.string(),
  donationMethod: DonationMethodSchema,
  stripePaymentIntentId: z.string().optional(),
  stripeChargeId: z.string().optional(),
  isAnonymous: z.boolean(),
  message: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  organization: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }).optional(),
  listing: z.object({
    id: z.string().uuid(),
    title: z.string(),
  }).optional(),
});

export type Donation = z.infer<typeof DonationSchema>;

// Create donation checkout request schema
export const CreateDonationCheckoutRequestSchema = z.object({
  organizationId: z.string().uuid(),
  listingId: z.string().uuid().optional(),
  amountCents: z.number().min(100), // minimum $1.00
  currency: z.string().default('USD'),
  donationMethod: DonationMethodSchema,
  isAnonymous: z.boolean().default(false),
  message: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CreateDonationCheckoutRequest = z.infer<typeof CreateDonationCheckoutRequestSchema>;

// Stripe checkout session response schema
export const StripeCheckoutSessionSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  paymentIntentId: z.string().optional(),
});

export type StripeCheckoutSession = z.infer<typeof StripeCheckoutSessionSchema>;

// Receipt schema
export const ReceiptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  donationId: z.string().uuid().optional(),
  receiptNumber: z.string(),
  amountCents: z.number().optional(),
  currency: z.string().optional(),
  receiptData: z.record(z.any()).optional(),
  pdfUrl: z.string().url().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Receipt = z.infer<typeof ReceiptSchema>;

// Webhook event schema
export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  created: z.number(),
});

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
