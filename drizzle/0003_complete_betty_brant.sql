CREATE TABLE `physics_problems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`problemText` text NOT NULL,
	`problemImageUrl` text,
	`category` varchar(100),
	`difficulty` enum('easy','medium','hard') DEFAULT 'medium',
	`isBookmarked` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `physics_problems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `problem_solutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`problemId` int,
	`solution` text,
	`steps` text,
	`formulas` text,
	`diagramUrl` text,
	`hints` text,
	`explanation` text,
	`status` enum('pending','generating','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `problem_solutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `physics_problems` ADD CONSTRAINT `physics_problems_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `problem_solutions` ADD CONSTRAINT `problem_solutions_problemId_physics_problems_id_fk` FOREIGN KEY (`problemId`) REFERENCES `physics_problems`(`id`) ON DELETE no action ON UPDATE no action;