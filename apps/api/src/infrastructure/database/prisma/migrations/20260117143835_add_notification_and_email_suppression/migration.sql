-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "sourceEntity" TEXT,
    "sourceEntityId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastError" TEXT,
    "providerMessageId" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "queuedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_suppression" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "providerEventId" TEXT,
    "providerData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "email_suppression_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_status_scheduledAt_idx" ON "notification"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "notification_memberId_idx" ON "notification"("memberId");

-- CreateIndex
CREATE INDEX "notification_providerMessageId_idx" ON "notification"("providerMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "email_suppression_email_key" ON "email_suppression"("email");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
