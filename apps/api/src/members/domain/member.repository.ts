import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';

import { MemberEntity } from './entities/member.entity';
import { FindMembersModelParams, MemberModel } from './member.types';

export const MEMBER_REPOSITORY_PROVIDER = Symbol('MemberRepository');

export interface MemberRepository
  extends
    PaginatedRepository<MemberEntity>,
    ReadableRepository<MemberEntity>,
    WriteableRepository<MemberEntity> {
  findAll(params: FindMembersModelParams): Promise<MemberModel[]>;
}
