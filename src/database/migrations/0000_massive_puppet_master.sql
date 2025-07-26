CREATE TABLE `servers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`map` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`players` smallint unsigned NOT NULL DEFAULT 0,
	`maxPlayers` smallint unsigned NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `servers_id` PRIMARY KEY(`id`)
);
