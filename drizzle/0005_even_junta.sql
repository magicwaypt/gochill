ALTER TABLE "participations" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "submission_attempts" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "submission_attempts" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_sync_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_account_number" text;--> statement-breakpoint
ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_sync_error" text;--> statement-breakpoint
ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_synced_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participations" ALTER COLUMN "d365_synced_at" SET DATA TYPE timestamp with time zone;
