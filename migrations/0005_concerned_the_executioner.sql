ALTER TABLE "url_visits" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "url_visits" CASCADE;--> statement-breakpoint
ALTER TABLE "urls" RENAME COLUMN "short_url" TO "short_code";--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT "urls_short_url_unique";--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_short_code_unique" UNIQUE("short_code");