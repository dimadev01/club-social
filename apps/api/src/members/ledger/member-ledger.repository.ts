import type {
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  QueryContext,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type {
  MemberLedgerEntryDetailReadModel,
  MemberLedgerEntryPaginatedExtraModel,
  MemberLedgerEntryPaginatedModel,
} from './member-ledger-entry-read-models';

import { MemberLedgerEntryEntity } from './domain/member-ledger-entry.entity';

export const MEMBER_LEDGER_REPOSITORY_PROVIDER = Symbol(
  'MemberLedgerRepository',
);

export interface MemberLedgerRepository
  extends
    ReadableRepository<MemberLedgerEntryEntity>,
    WriteableRepository<MemberLedgerEntryEntity> {
  findByIdReadModel(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<MemberLedgerEntryDetailReadModel | null>;
  findForExport(
    params: ExportDataDto,
    context?: QueryContext,
  ): Promise<MemberLedgerEntryPaginatedModel[]>;
  findPaginated(
    params: GetPaginatedDataDto,
    context?: QueryContext,
  ): Promise<
    PaginatedDataResultDto<
      MemberLedgerEntryPaginatedModel,
      MemberLedgerEntryPaginatedExtraModel
    >
  >;
  getBalanceByMemberId(memberId: UniqueId): Promise<SignedAmount>;
}
