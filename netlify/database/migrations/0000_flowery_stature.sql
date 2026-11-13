CREATE TABLE "advertising_bids" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"business" text NOT NULL,
	"amount_paise" integer NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"submitter_hash" text NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" text,
	"review_reason" text
);
--> statement-breakpoint
CREATE TABLE "bid_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"bid_id" text NOT NULL,
	"actor" text NOT NULL,
	"previous_status" text NOT NULL,
	"status" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bid_revisions" ADD CONSTRAINT "bid_revisions_bid_id_advertising_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."advertising_bids"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bid_status_idx" ON "advertising_bids" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bid_submitter_idx" ON "advertising_bids" USING btree ("submitter_hash");--> statement-breakpoint
CREATE INDEX "bid_revision_bid_idx" ON "bid_revisions" USING btree ("bid_id");