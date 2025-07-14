ALTER TABLE "user_preferences" ADD COLUMN "onboarding_completed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "onboarding_step" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "welcome_message_seen" boolean DEFAULT false;