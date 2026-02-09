import { MemberCategory, MemberStatus } from '@club-social/shared/members';
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
  MemberStatisticsReadModel,
} from './member-read-models';

export const MEMBER_REPOSITORY_PROVIDER = Symbol('MemberRepository');

export interface FindMembersByCategoryParams {
  category: MemberCategory;
  status: MemberStatus;
}

export interface MemberRepository
  extends
    PaginatedRepository<
      MemberPaginatedReadModel,
      MemberPaginatedExtraReadModel
    >,
    ReadableRepository<MemberEntity>,
    WriteableRepository<MemberEntity> {
  findByCategoryReadModel(
    params: FindMembersByCategoryParams,
  ): Promise<MemberSearchReadModel[]>;
  findByIdReadModel(id: UniqueId): Promise<MemberReadModel | null>;
  findByIdReadModelOrThrow(id: UniqueId): Promise<MemberReadModel>;
  findByUserIdReadModel(userId: UniqueId): Promise<MemberReadModel | null>;
  findForExport(params: ExportDataDto): Promise<MemberPaginatedReadModel[]>;
  findUniqueByUserId(userId: UniqueId): Promise<MemberEntity>;
  getStatistics(topDebtorsLimit?: number): Promise<MemberStatisticsReadModel>;
  search(params: MemberSearchParams): Promise<MemberSearchReadModel[]>;
}
