import { Injectable } from '@nestjs/common';

import {
  GroupCreateInput,
  GroupGetPayload,
  GroupUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { GroupEntity } from '../domain/entities/group.entity';
import { PrismaGroupMemberMapper } from './prisma-group-member.mapper';

@Injectable()
export class PrismaGroupMapper {
  public constructor(
    private readonly prismaGroupMemberMapper: PrismaGroupMemberMapper,
  ) {}

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
          this.prismaGroupMemberMapper.toDomain(groupMember),
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
