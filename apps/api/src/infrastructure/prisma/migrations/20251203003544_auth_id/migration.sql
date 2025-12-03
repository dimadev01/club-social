-- DropIndex
DROP INDEX "User_authId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "authId" DROP NOT NULL;
