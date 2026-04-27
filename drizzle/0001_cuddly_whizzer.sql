CREATE TABLE `agents` (
	`id` varchar(36) NOT NULL,
	`name` varchar(128) NOT NULL,
	`medal` varchar(8) DEFAULT '🥇',
	`leads` int NOT NULL DEFAULT 0,
	`tours` int NOT NULL DEFAULT 0,
	`closes` int NOT NULL DEFAULT 0,
	`earnings` varchar(32) DEFAULT '₪0',
	`color` varchar(32) DEFAULT 'var(--ra-blue)',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` varchar(36) NOT NULL,
	`name` varchar(128) NOT NULL,
	`type` varchar(64) DEFAULT '',
	`detail` text DEFAULT (''),
	`time` varchar(64) NOT NULL,
	`agent` varchar(128) DEFAULT '',
	`status` enum('confirmed','pending','cancelled') NOT NULL DEFAULT 'pending',
	`nightCallSent` boolean DEFAULT false,
	`nightCallResult` enum('confirmed','no-answer'),
	`morningCallStatus` enum('scheduled','retry','done') NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `follow_up_leads` (
	`id` varchar(36) NOT NULL,
	`name` varchar(128) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`lastMsg` text DEFAULT (''),
	`daysAgo` int DEFAULT 0,
	`status` enum('pending','sent','replied') DEFAULT 'pending',
	`urgency` enum('high','medium','low') DEFAULT 'medium',
	`avatar` varchar(8) DEFAULT '👤',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `follow_up_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` varchar(36) NOT NULL,
	`name` varchar(128) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`type` enum('buyer','seller') NOT NULL DEFAULT 'buyer',
	`status` enum('hot','warm','cold') NOT NULL DEFAULT 'warm',
	`area` varchar(128) DEFAULT '',
	`rooms` varchar(32) DEFAULT '',
	`budget` varchar(64),
	`agent` varchar(128) DEFAULT '',
	`lastContact` varchar(64) DEFAULT '',
	`daysAgo` int DEFAULT 0,
	`notes` text,
	`avatar` varchar(8) DEFAULT '👤',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `missed_calls` (
	`id` varchar(36) NOT NULL,
	`name` varchar(128),
	`phone` varchar(32) NOT NULL,
	`time` varchar(64) DEFAULT '',
	`urgency` enum('high','medium','low') DEFAULT 'medium',
	`source` varchar(64) DEFAULT '',
	`handled` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `missed_calls_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pipeline_deals` (
	`id` varchar(36) NOT NULL,
	`name` varchar(256) NOT NULL,
	`detail` text DEFAULT (''),
	`agent` varchar(128) DEFAULT '',
	`stage` enum('lead','tour','negotiation','contract','closed') NOT NULL DEFAULT 'lead',
	`tag` varchar(64) DEFAULT '',
	`tagColor` varchar(64) DEFAULT 'var(--ra-blue)',
	`value` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pipeline_deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` varchar(36) NOT NULL,
	`emoji` varchar(8) DEFAULT '🏠',
	`name` varchar(256) NOT NULL,
	`tags` text NOT NULL DEFAULT ('[]'),
	`price` varchar(64) NOT NULL,
	`agent` varchar(128) DEFAULT '',
	`matches` int DEFAULT 0,
	`bgColor` varchar(64) DEFAULT 'rgba(59,130,246,0.08)',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
