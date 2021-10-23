/*
  Warnings:

  - You are about to drop the column `user_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `spending` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_ibfk_1`;

-- DropForeignKey
ALTER TABLE `spending` DROP FOREIGN KEY `spending_ibfk_2`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `user_id`,
    ADD COLUMN `user_uuid` VARCHAR(255) NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE `spending` DROP COLUMN `user_id`,
    ADD COLUMN `user_uuid` VARCHAR(255) NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `user_uuid_old` VARCHAR(36) NOT NULL DEFAULT 'null',
    MODIFY `user_uuid` VARCHAR(255) NOT NULL DEFAULT 'null',
    ADD PRIMARY KEY (`user_uuid`);

-- CreateIndex
CREATE INDEX `user_uuid` ON `categories`(`user_uuid`);

-- CreateIndex
CREATE INDEX `user_uuid` ON `spending`(`user_uuid`);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`user_uuid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `spending` ADD CONSTRAINT `spending_ibfk_2` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`user_uuid`) ON DELETE NO ACTION ON UPDATE NO ACTION;
