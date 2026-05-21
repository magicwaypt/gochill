ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_sync_status" text DEFAULT 'pending' NOT NULL;
ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_account_number" text;
ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_sync_error" text;
ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "d365_synced_at" timestamp;
