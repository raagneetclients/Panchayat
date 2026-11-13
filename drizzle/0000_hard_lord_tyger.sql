CREATE TABLE IF NOT EXISTS `advertising_bids` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`business` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL,
	`submitter_hash` text NOT NULL,
	`reviewed_at` text,
	`reviewed_by` text,
	`review_reason` text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `bid_status_idx` ON `advertising_bids` (`status`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `bid_submitter_idx` ON `advertising_bids` (`submitter_hash`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `bid_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`bid_id` text NOT NULL,
	`actor` text NOT NULL,
	`previous_status` text NOT NULL,
	`status` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` text NOT NULL
);
