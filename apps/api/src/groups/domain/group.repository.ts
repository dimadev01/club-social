import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { GroupEntity } from './entities/group.entity';
import { GroupPaginatedReadModel, GroupReadModel } from './group-read-models';

export const GROUP_REPOSITORY_PROVIDER = Symbol('GroupRepository');

export interface GroupRepository
  extends
    PaginatedRepository<GroupPaginatedReadModel>,
    ReadableRepository<GroupEntity>,
    WriteableRepository<GroupEntity> {
  findByIdReadModel(id: UniqueId): Promise<GroupReadModel | null>;
  findGroupSizeByMemberId(memberId: UniqueId): Promise<number>;
}
