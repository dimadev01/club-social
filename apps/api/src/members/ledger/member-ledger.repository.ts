import type {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';

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
  findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<
    PaginatedDataResultDto<
      MemberLedgerEntryPaginatedModel,
      MemberLedgerEntryPaginatedExtraModel
    >
  >;
}
