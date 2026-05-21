ALTER TABLE "participations" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'pending' NOT NULL;
