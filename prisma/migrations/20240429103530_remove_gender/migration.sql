/*
  Warnings:

  - You are about to drop the column `genderId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Gender` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_genderId_fkey";

-- DropIndex
DROP INDEX "User_genderId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "genderId";

-- DropTable
DROP TABLE "Gender";
