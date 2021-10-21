-- CreateTable
CREATE TABLE `categories` (
    `cat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cat_uuid` VARCHAR(36) NOT NULL,
    `cat_name` VARCHAR(255) NOT NULL,
    `cat_total` INTEGER NULL,
    `cat_budget` INTEGER NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`cat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spending` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_uuid` VARCHAR(36) NOT NULL,
    `item_name` VARCHAR(255) NOT NULL,
    `item_price` FLOAT NOT NULL,
    `create_dttm` DATETIME(0) NOT NULL,
    `cat_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `cat_id`(`cat_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_uuid` VARCHAR(36) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,
    `user_currency` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `spending` ADD CONSTRAINT `spending_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `categories`(`cat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `spending` ADD CONSTRAINT `spending_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
