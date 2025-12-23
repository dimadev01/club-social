import { ExportRequest } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from './entities/member.entity';
import {
  FindMembersModelParams,
  MemberDetailModel,
  MemberListModel,
  MemberPaginatedModel,
  MemberSearchModel,
  MemberSearchParams,
} from './member.types';

export const MEMBER_REPOSITORY_PROVIDER = Symbol('MemberRepository');

export interface MemberRepository
  extends
    PaginatedRepository<MemberPaginatedModel>,
    ReadableRepository<MemberEntity>,
    WriteableRepository<MemberEntity> {
  findAll(params: FindMembersModelParams): Promise<MemberListModel[]>;
  findForExport(params: ExportRequest): Promise<MemberPaginatedModel[]>;
  findOneModel(id: UniqueId): Promise<MemberDetailModel | null>;
  search(params: MemberSearchParams): Promise<MemberSearchModel[]>;
}
