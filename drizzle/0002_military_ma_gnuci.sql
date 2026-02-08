CREATE TABLE `structured_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int,
	`keyPoints` text,
	`formulasData` text,
	`examples` text,
	`visualData` text,
	`practiceProblems` text,
	`videoUrl` text,
	`diagramSvg` text,
	`interactiveData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `structured_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `structured_content` ADD CONSTRAINT `structured_content_contentId_generated_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `generated_content`(`id`) ON DELETE no action ON UPDATE no action;