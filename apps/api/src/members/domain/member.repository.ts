import { ExportDataDto } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from './entities/member.entity';
import {
  MemberDetailModel,
  MemberPaginatedExtraModel,
  MemberPaginatedModel,
  MemberSearchModel,
  MemberSearchParams,
} from './member.types';

export const MEMBER_REPOSITORY_PROVIDER = Symbol('MemberRepository');

export interface MemberRepository
  extends
    PaginatedRepository<MemberPaginatedModel, MemberPaginatedExtraModel>,
    ReadableRepository<MemberEntity>,
    WriteableRepository<MemberEntity> {
  findForExport(params: ExportDataDto): Promise<MemberPaginatedModel[]>;
  findOneModel(id: UniqueId): Promise<MemberDetailModel | null>;
  search(params: MemberSearchParams): Promise<MemberSearchModel[]>;
}
