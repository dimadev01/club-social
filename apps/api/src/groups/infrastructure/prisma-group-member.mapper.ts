import { Injectable } from '@nestjs/common';

import {
  GroupMemberModel,
  GroupMemberUpsertArgs,
} from '@/infrastructure/database/prisma/generated/models';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { GroupMemberEntity } from '../domain/entities/group-member.entity';
import { GroupEntity } from '../domain/entities/group.entity';

@Injectable()
export class PrismaGroupMemberMapper {
  public toDomain(groupMember: GroupMemberModel): GroupMemberEntity {
    return GroupMemberEntity.fromPersistence({
      groupId: UniqueId.raw({ value: groupMember.groupId }),
      memberId: UniqueId.raw({ value: groupMember.memberId }),
    });
  }

  public toUpserts(group: GroupEntity): GroupMemberUpsertArgs[] {
    return group.members.map((groupMember) => ({
      create: {
        groupId: groupMember.groupId.value,
        id: groupMember.id.value,
        memberId: groupMember.memberId.value,
      },
      update: {
        groupId: groupMember.groupId.value,
        memberId: groupMember.memberId.value,
      },
      where: {
        groupId: groupMember.groupId.value,
        memberId: groupMember.memberId.value,
      },
    }));
  }
}
