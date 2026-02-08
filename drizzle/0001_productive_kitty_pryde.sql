CREATE TABLE `generated_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`topic` varchar(255) NOT NULL,
	`category` varchar(100),
	`explanation` text,
	`formulas` text,
	`animationCode` text,
	`diagramUrl` text,
	`videoUrl` text,
	`status` enum('pending','generating','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generated_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `physics_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('mechanics','waves','electromagnetism','quantum','thermodynamics','optics','relativity') NOT NULL,
	`description` text,
	`keywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `physics_topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `generated_content` ADD CONSTRAINT `generated_content_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;