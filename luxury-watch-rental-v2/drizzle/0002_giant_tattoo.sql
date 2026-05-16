CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`watchId` int NOT NULL,
	`userId` int NOT NULL,
	`rentalId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
