CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rentalId` int NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','paid','overdue') NOT NULL DEFAULT 'pending',
	`dueDate` timestamp,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rentals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`watchId` int NOT NULL,
	`userId` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`status` enum('pending','active','completed','cancelled') NOT NULL DEFAULT 'pending',
	`totalCost` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rentals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand` varchar(255) NOT NULL,
	`model` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` varchar(500),
	`caseSize` varchar(50),
	`movement` varchar(100),
	`waterResistance` varchar(50),
	`material` varchar(100),
	`available` boolean NOT NULL DEFAULT true,
	`dailyRate` int NOT NULL DEFAULT 200,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `watches_id` PRIMARY KEY(`id`)
);
