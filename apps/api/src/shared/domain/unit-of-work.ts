import type { DueEntity } from '@/dues/domain/entities/due.entity';
import type { MemberLedgerEntryEntity } from '@/members/ledger/domain/member-ledger-entry.entity';
import type { MovementEntity } from '@/movements/domain/entities/movement.entity';
import type { PaymentEntity } from '@/payments/domain/entities/payment.entity';

import type { WriteableRepository } from './repository';

/**
 * Repositories available within a transaction.
 * Each repository exposes only the save method with proper typing.
 */
export interface TransactionalRepositories {
  duesRepository: WriteableRepository<DueEntity>;
  memberLedgerRepository: WriteableRepository<MemberLedgerEntryEntity>;
  movementsRepository: WriteableRepository<MovementEntity>;
  paymentsRepository: WriteableRepository<PaymentEntity>;
}

/**
 * Unit of Work pattern interface.
 * Ensures multiple repository operations are committed atomically.
 */
export interface UnitOfWork {
  /**
   * Execute a function within a transaction.
   * All repository operations inside the callback will be atomic.
   *
   * @param fn - Function that receives transactional repositories
   * @returns The result of the function
   */
  execute<T>(fn: (repos: TransactionalRepositories) => Promise<T>): Promise<T>;
}

export const UNIT_OF_WORK_PROVIDER = Symbol('UnitOfWork');
