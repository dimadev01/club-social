-- AlterTable
ALTER TABLE "member" ADD COLUMN     "maritalStatus" TEXT,
ALTER COLUMN "nationality" DROP NOT NULL,
ALTER COLUMN "sex" DROP NOT NULL;
