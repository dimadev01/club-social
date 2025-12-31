import { ExportDataDto } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from './entities/member.entity';
import {
  MemberPaginatedExtraReadModel,
  MemberPaginatedReadModel,
  MemberReadModel,
  MemberSearchParams,
  MemberSearchReadModel,
} from './member-read-models';

export const MEMBER_REPOSITORY_PROVIDER = Symbol('MemberRepository');

export interface MemberRepository
  extends
    PaginatedRepository<
      MemberPaginatedReadModel,
      MemberPaginatedExtraReadModel
    >,
    ReadableRepository<MemberEntity>,
    WriteableRepository<MemberEntity> {
  findByIdReadModel(id: UniqueId): Promise<MemberReadModel | null>;
  findForExport(params: ExportDataDto): Promise<MemberPaginatedReadModel[]>;
  search(params: MemberSearchParams): Promise<MemberSearchReadModel[]>;
}
