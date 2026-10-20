CREATE TABLE `chat_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`blocked_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chat_block_pair` ON `chat_blocks` (`owner_id`,`blocked_id`);--> statement-breakpoint
CREATE TABLE `chat_members` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`user_id` text,
	`email` text,
	`contact` text NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`invite_hash` text,
	`expires_at` integer,
	`joined_at` integer,
	`last_read_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `chat_member_user` ON `chat_members` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `chat_invite_email` ON `chat_members` (`email`,`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `chat_thread_user` ON `chat_members` (`thread_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `chat_thread_email` ON `chat_members` (`thread_id`,`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `chat_invite_hash` ON `chat_members` (`invite_hash`);--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`sender_name` text NOT NULL,
	`body` text NOT NULL,
	`share` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `chat_message_thread` ON `chat_messages` (`thread_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `chat_message_sender` ON `chat_messages` (`sender_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `chat_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`is_group` integer DEFAULT 0 NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `chat_creator` ON `chat_threads` (`created_by`,`created_at`);