import { z } from 'zod';

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().optional(),
  totalPages: z.number().optional(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// Paginated response schema
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationSchema,
  });

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

// Location schema (PostGIS point)
export const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type Location = z.infer<typeof LocationSchema>;

// Date range schema
export const DateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type DateRange = z.infer<typeof DateRangeSchema>;

// Search filters schema
export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  location: LocationSchema.optional(),
  radius: z.number().min(1).max(100).optional(), // in miles
  dateRange: DateRangeSchema.optional(),
  tags: z.array(z.string()).optional(),
  minAge: z.number().min(0).optional(),
  maxAge: z.number().min(0).optional(),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

// Sort options schema
export const SortOptionsSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('desc'),
});

export type SortOptions = z.infer<typeof SortOptionsSchema>;

// API error schema
export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  timestamp: z.string(),
  path: z.string(),
  method: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Success response schema
export const SuccessResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
