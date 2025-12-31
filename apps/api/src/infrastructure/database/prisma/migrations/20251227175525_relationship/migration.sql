/*
  Warnings:

  - A unique constraint covering the columns `[memberLedgerEntryId]` on the table `due_settlement` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "due_settlement_dueId_memberLedgerEntryId_key";

-- DropIndex
DROP INDEX "due_settlement_memberLedgerEntryId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "due_settlement_memberLedgerEntryId_key" ON "due_settlement"("memberLedgerEntryId");
