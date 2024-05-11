/*
  Warnings:

  - You are about to drop the column `passwordId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_passwordId_fkey";

-- DropIndex
DROP INDEX "User_passwordId_key";

-- AlterTable
ALTER TABLE "AuthSession" ALTER COLUMN "userAgent" DROP NOT NULL,
ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "fingerprint" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordId",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- DropTable
DROP TABLE "Password";
