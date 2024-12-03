/*
  Warnings:

  - You are about to drop the column `sessionToken` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_sessionToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sessionToken";
