import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const listingTypeEnum = pgEnum('listing_type', ['volunteer_shift', 'cash_campaign']);
export const donationMethodEnum = pgEnum('donation_method', ['stripe', 'apple_pay', 'google_pay']);
export const appStatusEnum = pgEnum('app_status', ['new', 'review', 'accepted', 'scheduled', 'completed', 'cancelled']);
export const orgStatusEnum = pgEnum('org_status', ['pending', 'approved', 'rejected', 'suspended']);
export const userRoleEnum = pgEnum('user_role', ['user', 'org_admin', 'super_admin']);
export const orgItemKindEnum = pgEnum('org_item_kind', ['EVENT', 'NEWS', 'PROJECT']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  dateOfBirth: timestamp('date_of_birth', { withTimezone: true }),
  profileImageUrl: text('profile_image_url'),
  bio: text('bio'),
  location: text('location'), // Changed from point to text for now
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('US'),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  role: userRoleEnum('role').default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Organizations table
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ein: varchar('ein', { length: 20 }).unique(),
  websiteUrl: text('website_url'),
  logoUrl: text('logo_url'),
  location: text('location'), // Changed from point to text for now
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('US'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  status: orgStatusEnum('status').default('pending'),
  stripeAccountId: varchar('stripe_account_id', { length: 255 }),
  stripeAccountVerified: boolean('stripe_account_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Organization admins table
export const organizationAdmins = pgTable('organization_admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).default('admin'),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Listings table
export const listings = pgTable('listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  listingType: listingTypeEnum('listing_type').notNull(),
  location: text('location'), // Changed from point to text for now
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('US'),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  applicationDeadline: timestamp('application_deadline', { withTimezone: true }),
  maxParticipants: integer('max_participants'),
  minAge: integer('min_age'),
  maxAge: integer('max_age'),
  requiredSkills: text('required_skills').array(),
  tags: text('tags').array(),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Shifts table
export const shifts = pgTable('shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  maxVolunteers: integer('max_volunteers'),
  supervisorName: varchar('supervisor_name', { length: 255 }),
  supervisorPhone: varchar('supervisor_phone', { length: 20 }),
  supervisorEmail: varchar('supervisor_email', { length: 255 }),
  checkInInstructions: text('check_in_instructions'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Applications table
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  shiftId: uuid('shift_id').references(() => shifts.id, { onDelete: 'cascade' }),
  status: appStatusEnum('status').default('new'),
  applicationText: text('application_text'),
  skills: text('skills').array(),
  availability: text('availability'),
  emergencyContactName: varchar('emergency_contact_name', { length: 255 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 20 }),
  notes: text('notes'),
  appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Attendance table
export const attendance = pgTable('attendance', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  shiftId: uuid('shift_id').notNull().references(() => shifts.id, { onDelete: 'cascade' }),
  checkInTime: timestamp('check_in_time', { withTimezone: true }),
  checkOutTime: timestamp('check_out_time', { withTimezone: true }),
  checkInLocation: text('check_in_location'), // Changed from point to text for now
  checkOutLocation: text('check_out_location'), // Changed from point to text for now
  supervisorVerified: boolean('supervisor_verified').default(false),
  supervisorId: uuid('supervisor_id').references(() => users.id),
  hoursWorked: decimal('hours_worked', { precision: 4, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Donations table
export const donations = pgTable('donations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  listingId: uuid('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  amountCents: integer('amount_cents').notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  donationMethod: donationMethodEnum('donation_method').notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeChargeId: varchar('stripe_charge_id', { length: 255 }),
  isAnonymous: boolean('is_anonymous').default(false),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// XP events table
export const xpEvents = pgTable('xp_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  xpAmount: integer('xp_amount').notNull(),
  description: text('description'),
  referenceId: uuid('reference_id'),
  referenceType: varchar('reference_type', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Badges table
export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  xpRequired: integer('xp_required').default(0),
  category: varchar('category', { length: 50 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// User badges table
export const userBadges = pgTable('user_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  earnedAt: timestamp('earned_at', { withTimezone: true }).defaultNow(),
});

// Receipts table
export const receipts = pgTable('receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  donationId: uuid('donation_id').references(() => donations.id, { onDelete: 'cascade' }),
  receiptNumber: varchar('receipt_number', { length: 50 }).unique().notNull(),
  amountCents: integer('amount_cents'),
  currency: varchar('currency', { length: 3 }).default('USD'),
  receiptData: jsonb('receipt_data'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Outbox table
export const outbox = pgTable('outbox', {
  id: uuid('id').primaryKey().defaultRandom(),
  topic: varchar('topic', { length: 100 }).notNull(),
  payload: jsonb('payload').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  retryCount: integer('retry_count').default(0),
  maxRetries: integer('max_retries').default(3),
  status: varchar('status', { length: 20 }).default('pending'),
});

// Organization follows table
export const organizationFollows = pgTable('organization_follows', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: { columns: [table.userId, table.orgId] },
}));

// Organization titles table
export const orgTitles = pgTable('org_titles', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  borderToken: varchar('border_token', { length: 100 }),
  iconToken: varchar('icon_token', { length: 100 }),
  rules: jsonb('rules').notNull(),
  xpReward: integer('xp_reward').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  orgCodeUnique: { columns: [table.orgId, table.code] },
}));

// User org titles table
export const userOrgTitles = pgTable('user_org_titles', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  titleId: uuid('title_id').notNull().references(() => orgTitles.id, { onDelete: 'cascade' }),
  awardedAt: timestamp('awarded_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: { columns: [table.userId, table.orgId, table.titleId] },
}));

// Organization feed items table
export const orgFeedItems = pgTable('org_feed_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  kind: orgItemKindEnum('kind').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary'),
  description: text('description'),
  location: text('location'), // PostGIS geography stored as text for now
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  url: text('url'),
  imageUrl: text('image_url'),
  data: jsonb('data'),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
  donations: many(donations),
  xpEvents: many(xpEvents),
  userBadges: many(userBadges),
  receipts: many(receipts),
  organizationAdmins: many(organizationAdmins),
  organizationFollows: many(organizationFollows),
  userOrgTitles: many(userOrgTitles),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  listings: many(listings),
  donations: many(donations),
  organizationAdmins: many(organizationAdmins),
  organizationFollows: many(organizationFollows),
  orgTitles: many(orgTitles),
  orgFeedItems: many(orgFeedItems),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [listings.organizationId],
    references: [organizations.id],
  }),
  shifts: many(shifts),
  applications: many(applications),
  donations: many(donations),
}));

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
  listing: one(listings, {
    fields: [shifts.listingId],
    references: [listings.id],
  }),
  applications: many(applications),
  attendance: many(attendance),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [applications.listingId],
    references: [listings.id],
  }),
  shift: one(shifts, {
    fields: [applications.shiftId],
    references: [shifts.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  application: one(applications, {
    fields: [attendance.applicationId],
    references: [applications.id],
  }),
  user: one(users, {
    fields: [attendance.userId],
    references: [users.id],
  }),
  shift: one(shifts, {
    fields: [attendance.shiftId],
    references: [shifts.id],
  }),
}));

export const donationsRelations = relations(donations, ({ one, many }) => ({
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [donations.organizationId],
    references: [organizations.id],
  }),
  listing: one(listings, {
    fields: [donations.listingId],
    references: [listings.id],
  }),
  receipts: many(receipts),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const receiptsRelations = relations(receipts, ({ one }) => ({
  user: one(users, {
    fields: [receipts.userId],
    references: [users.id],
  }),
  donation: one(donations, {
    fields: [receipts.donationId],
    references: [donations.id],
  }),
}));

export const organizationAdminsRelations = relations(organizationAdmins, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationAdmins.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationAdmins.userId],
    references: [users.id],
  }),
}));

export const organizationFollowsRelations = relations(organizationFollows, ({ one }) => ({
  user: one(users, {
    fields: [organizationFollows.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [organizationFollows.orgId],
    references: [organizations.id],
  }),
}));

export const orgTitlesRelations = relations(orgTitles, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [orgTitles.orgId],
    references: [organizations.id],
  }),
  userOrgTitles: many(userOrgTitles),
}));

export const userOrgTitlesRelations = relations(userOrgTitles, ({ one }) => ({
  user: one(users, {
    fields: [userOrgTitles.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [userOrgTitles.orgId],
    references: [organizations.id],
  }),
  title: one(orgTitles, {
    fields: [userOrgTitles.titleId],
    references: [orgTitles.id],
  }),
}));

export const orgFeedItemsRelations = relations(orgFeedItems, ({ one }) => ({
  organization: one(organizations, {
    fields: [orgFeedItems.orgId],
    references: [organizations.id],
  }),
}));
