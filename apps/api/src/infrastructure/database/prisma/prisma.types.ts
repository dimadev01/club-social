import type { PrismaClient } from './generated/client';

/**
 * A Prisma client that can be used for database operations.
 * This can be either the full PrismaService or a transaction client.
 */
export type PrismaClientLike = PrismaClient | PrismaTransactionClient;

/**
 * The Prisma transaction client type.
 * This is what Prisma passes to the $transaction callback.
 */
export type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];
