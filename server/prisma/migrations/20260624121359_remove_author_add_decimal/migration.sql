/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Book` DROP COLUMN `author`,
    ADD COLUMN `publisher` VARCHAR(191) NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL;
