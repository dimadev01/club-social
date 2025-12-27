import {
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';

import { MemberLedgerEntryEntity } from './domain/member-ledger-entry.entity';

export const MEMBER_LEDGER_REPOSITORY_PROVIDER = Symbol(
  'MemberLedgerRepository',
);

export interface MemberLedgerRepository
  extends
    ReadableRepository<MemberLedgerEntryEntity>,
    WriteableRepository<MemberLedgerEntryEntity> {}
