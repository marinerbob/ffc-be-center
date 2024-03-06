/*
  Warnings:

  - Added the required column `value` to the `Gender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gender" ADD COLUMN     "value" TEXT NOT NULL;
