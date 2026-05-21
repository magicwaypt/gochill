CREATE TABLE IF NOT EXISTS "submission_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"has_talao" boolean NOT NULL,
	"has_foto" boolean NOT NULL,
	"outcome" text NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
