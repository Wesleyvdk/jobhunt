import { pgTable, serial, text, varchar, timestamp, date, integer, boolean, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  password: varchar('password', { length: 255 }), // For email/password auth
  provider: varchar('provider', { length: 50 }), // 'credentials', 'google', 'github'
  providerId: varchar('provider_id', { length: 255 }), // ID from OAuth provider
  image: text('image'), // Profile image URL
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  position: text('position').notNull(),
  applicationDate: date('application_date').notNull(),
  status: text('status').notNull(),
  notes: text('notes'),
  jobLink: text('job_link'),
  followUpDate: date('follow_up_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  
  // Dashboard Layout
  defaultView: varchar('default_view', { length: 20 }).default('kanban'),
  itemsPerPage: integer('items_per_page').default(10),
  showCompletedJobs: boolean('show_completed_jobs').default(true),
  compactMode: boolean('compact_mode').default(false),
  
  // Notifications
  emailNotifications: boolean('email_notifications').default(true),
  followUpReminders: boolean('follow_up_reminders').default(true),
  applicationDeadlines: boolean('application_deadlines').default(true),
  weeklyReports: boolean('weekly_reports').default(false),
  pushNotifications: boolean('push_notifications').default(false),
  
  // Date & Time
  dateFormat: varchar('date_format', { length: 20 }).default('MM/DD/YYYY'),
  timeFormat: varchar('time_format', { length: 5 }).default('12h'),
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  firstDayOfWeek: varchar('first_day_of_week', { length: 10 }).default('sunday'),
  
  // Export Settings
  defaultExportFormat: varchar('default_export_format', { length: 10 }).default('csv'),
  includeNotes: boolean('include_notes').default(true),
  includePrivateFields: boolean('include_private_fields').default(false),
  exportDateRange: varchar('export_date_range', { length: 20 }).default('all'),
  
  // Theme
  themeMode: varchar('theme_mode', { length: 10 }).default('system'),
  accentColor: varchar('accent_color', { length: 20 }).default('indigo'),
  fontSize: varchar('font_size', { length: 10 }).default('medium'),
  reducedMotion: boolean('reduced_motion').default(false),
  
  // Account Settings
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  sessionTimeout: integer('session_timeout').default(60), // minutes
  dataRetention: integer('data_retention').default(365), // days
  autoBackup: boolean('auto_backup').default(true),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;