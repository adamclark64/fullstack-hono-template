CREATE TABLE `count` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`ip` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `log` (
	`id` text PRIMARY KEY NOT NULL,
	`ts` text NOT NULL,
	`ip` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `count_ip_unique` ON `count` (`ip`);