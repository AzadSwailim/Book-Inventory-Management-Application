/*
  Warnings:

  - You are about to drop the column `description` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isbn` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `Book` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Book_isbn_key` ON `Book`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `description`,
    DROP COLUMN `isbn`,
    DROP COLUMN `publisher`;
