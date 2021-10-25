/*
  Warnings:

  - The primary key for the `spending` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `item_id` on the `spending` table. All the data in the column will be lost.
  - You are about to drop the column `user_password` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `spending` DROP PRIMARY KEY,
    DROP COLUMN `item_id`,
    ADD PRIMARY KEY (`item_uuid`);

-- AlterTable
ALTER TABLE `users` DROP COLUMN `user_password`,
    ALTER COLUMN `user_uuid` DROP DEFAULT;
