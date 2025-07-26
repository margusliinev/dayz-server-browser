CREATE TABLE `servers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`map` varchar(255),
	`name` varchar(255),
	`address` varchar(255) NOT NULL,
	`players` smallint unsigned DEFAULT 0,
	`maxPlayers` smallint unsigned DEFAULT 0,
	`status` enum('pending','online','offline') NOT NULL DEFAULT 'pending',
	`queried_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `servers_id` PRIMARY KEY(`id`),
	CONSTRAINT `servers_address_unique` UNIQUE(`address`)
);
