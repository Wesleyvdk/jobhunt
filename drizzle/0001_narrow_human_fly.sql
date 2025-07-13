CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"default_view" varchar(20) DEFAULT 'kanban',
	"items_per_page" integer DEFAULT 10,
	"show_completed_jobs" boolean DEFAULT true,
	"compact_mode" boolean DEFAULT false,
	"email_notifications" boolean DEFAULT true,
	"follow_up_reminders" boolean DEFAULT true,
	"application_deadlines" boolean DEFAULT true,
	"weekly_reports" boolean DEFAULT false,
	"push_notifications" boolean DEFAULT false,
	"date_format" varchar(20) DEFAULT 'MM/DD/YYYY',
	"time_format" varchar(5) DEFAULT '12h',
	"timezone" varchar(100) DEFAULT 'UTC',
	"first_day_of_week" varchar(10) DEFAULT 'sunday',
	"default_export_format" varchar(10) DEFAULT 'csv',
	"include_notes" boolean DEFAULT true,
	"include_private_fields" boolean DEFAULT false,
	"export_date_range" varchar(20) DEFAULT 'all',
	"theme_mode" varchar(10) DEFAULT 'system',
	"accent_color" varchar(20) DEFAULT 'indigo',
	"font_size" varchar(10) DEFAULT 'medium',
	"reduced_motion" boolean DEFAULT false,
	"two_factor_enabled" boolean DEFAULT false,
	"session_timeout" integer DEFAULT 60,
	"data_retention" integer DEFAULT 365,
	"auto_backup" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "application_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "follow_up_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;