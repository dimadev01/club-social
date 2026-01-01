import type {
  ExportDataDto,
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
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
  findDetailById(id: string): Promise<MemberLedgerEntryDetailReadModel | null>;
  findForExport(
    params: ExportDataDto,
  ): Promise<MemberLedgerEntryPaginatedModel[]>;
  findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<
    PaginatedDataResultDto<
      MemberLedgerEntryPaginatedModel,
      MemberLedgerEntryPaginatedExtraModel
    >
  >;
  getBalanceByMemberId(memberId: UniqueId): Promise<number>;
}
