/*
  Warnings:

  - You are about to drop the column `cat_budget` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `cat_total` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `user_uuid_old` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `cat_budget`,
    DROP COLUMN `cat_total`,
    ALTER COLUMN `user_uuid` DROP DEFAULT;

-- AlterTable
ALTER TABLE `spending` ALTER COLUMN `user_uuid` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `user_uuid_old`;
