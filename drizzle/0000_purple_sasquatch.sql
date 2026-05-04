CREATE TABLE "participations" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"telemovel" text NOT NULL,
	"talao_blob" text,
	"foto_blob" text,
	"aceite_maior_18" boolean NOT NULL,
	"aceite_termos" boolean NOT NULL,
	"aceite_privacidade" boolean NOT NULL,
	"aceite_marketing" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
