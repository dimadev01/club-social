import { Injectable } from '@nestjs/common';

import {
  GroupCreateInput,
  GroupGetPayload,
  GroupUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { GroupMemberEntity } from '../domain/entities/group-member.entity';
import { GroupEntity } from '../domain/entities/group.entity';

@Injectable()
export class PrismaGroupMapper {
  public toCreateInput(group: GroupEntity): GroupCreateInput {
    Guard.string(group.createdBy);

    return {
      createdBy: group.createdBy,
      id: group.id.value,
      name: group.name,
    };
  }

  public toDomain(
    group: GroupGetPayload<{ include: { members: true } }>,
  ): GroupEntity {
    return GroupEntity.fromPersistence(
      {
        members: group.members.map((groupMember) =>
          GroupMemberEntity.fromPersistence({
            groupId: UniqueId.raw({ value: groupMember.groupId }),
            memberId: UniqueId.raw({ value: groupMember.memberId }),
          }),
        ),
        name: group.name,
      },
      {
        audit: {
          createdAt: group.createdAt,
          createdBy: group.createdBy,
          updatedAt: group.updatedAt,
          updatedBy: group.updatedBy,
        },
        id: UniqueId.raw({ value: group.id }),
      },
    );
  }

  public toUpdateInput(group: GroupEntity): GroupUpdateInput {
    return {
      name: group.name,
      updatedBy: group.updatedBy,
    };
  }
}
