-- CreateTable
CREATE TABLE "movement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "voidReason" TEXT,
    "voidedAt" TIMESTAMP(3),
    "voidedBy" TEXT,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movement_type_idx" ON "movement"("type");

-- CreateIndex
CREATE INDEX "movement_category_idx" ON "movement"("category");

-- CreateIndex
CREATE INDEX "movement_status_idx" ON "movement"("status");

-- CreateIndex
CREATE INDEX "movement_date_idx" ON "movement"("date");

-- CreateIndex
CREATE INDEX "movement_createdAt_idx" ON "movement"("createdAt");

-- CreateIndex
CREATE INDEX "movement_paymentId_idx" ON "movement"("paymentId");
