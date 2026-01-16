import { MemberCategory, MemberStatus } from '@club-social/shared/members';
import {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';
import { Injectable } from '@nestjs/common';

import {
  GroupFindManyArgs,
  GroupGetPayload,
  GroupOrderByWithRelationInput,
  GroupWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { EntityNotFoundError } from '@/shared/domain/errors/entity-not-found.error';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { GroupEntity } from '../domain/entities/group.entity';
import {
  GroupPaginatedReadModel,
  GroupReadModel,
} from '../domain/group-read-models';
import { GroupRepository } from '../domain/group.repository';
import { PrismaGroupMemberMapper } from './prisma-group-member.mapper';
import { PrismaGroupMapper } from './prisma-group.mapper';

@Injectable()
export class PrismaGroupRepository implements GroupRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly groupMapper: PrismaGroupMapper,
    private readonly prismaGroupMemberMapper: PrismaGroupMemberMapper,
  ) {}

  public async findById(id: UniqueId): Promise<GroupEntity | null> {
    const group = await this.prismaService.group.findUnique({
      include: { members: true },
      where: { id: id.value },
    });

    if (!group) {
      return null;
    }

    return this.groupMapper.toDomain(group);
  }

  public async findByIdOrThrow(id: UniqueId): Promise<GroupEntity> {
    const group = await this.findById(id);

    if (!group) {
      throw new EntityNotFoundError();
    }

    return group;
  }

  public async findByIdReadModel(id: UniqueId): Promise<GroupReadModel | null> {
    const group = await this.prismaService.group.findUnique({
      include: {
        members: {
          include: { member: { include: { user: true } } },
          orderBy: { member: { user: { lastName: 'asc' } } },
        },
      },
      where: { id: id.value },
    });

    if (!group) {
      return null;
    }

    return this.toReadModel(group);
  }

  public async findByIds(ids: UniqueId[]): Promise<GroupEntity[]> {
    const groups = await this.prismaService.group.findMany({
      include: { members: true },
      where: { id: { in: ids.map((id) => id.value) } },
    });

    return groups.map((group) => this.groupMapper.toDomain(group));
  }

  public async findByMemberId(
    memberId: UniqueId,
  ): Promise<GroupReadModel | null> {
    const group = await this.prismaService.group.findFirst({
      include: {
        members: { include: { member: { include: { user: true } } } },
      },
      where: { members: { some: { memberId: memberId.value } } },
    });

    return group ? this.toReadModel(group) : null;
  }

  public async findGroupSizeByMemberId(memberId: UniqueId): Promise<number> {
    const membership = await this.prismaService.groupMember.findUnique({
      where: { memberId: memberId.value },
    });

    if (!membership) {
      return 0;
    }

    return this.prismaService.groupMember.count({
      where: { groupId: membership.groupId },
    });
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<PaginatedDataResultDto<GroupPaginatedReadModel, never>> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: {
        members: {
          include: { member: { include: { user: true } } },
          orderBy: { member: { user: { lastName: 'asc' } } },
        },
      },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies GroupFindManyArgs;

    const [groups, total] = await Promise.all([
      this.prismaService.group.findMany(query),
      this.prismaService.group.count({ where }),
    ]);

    return {
      data: groups.map((group) => ({
        id: group.id,
        members: group.members.map((groupMember) => ({
          id: groupMember.memberId,
          name: Name.raw({
            firstName: groupMember.member.user.firstName,
            lastName: groupMember.member.user.lastName,
          }).fullName,
        })),
        name: group.name,
      })),
      total,
    };
  }

  public async save(entity: GroupEntity, tx?: PrismaClientLike): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.groupMapper.toCreateInput(entity);
    const update = this.groupMapper.toUpdateInput(entity);

    const groupMemberUpserts = this.prismaGroupMemberMapper.toUpserts(entity);

    await client.group.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });

    await client.groupMember.deleteMany({
      where: { groupId: entity.id.value },
    });

    for (const groupMemberUpsert of groupMemberUpserts) {
      await client.groupMember.upsert({
        create: groupMemberUpsert.create,
        update: groupMemberUpsert.update,
        where: groupMemberUpsert.where,
      });
    }
  }

  private buildWhereAndOrderBy(params: GetPaginatedDataDto): {
    orderBy: GroupOrderByWithRelationInput[];
    where: GroupWhereInput;
  } {
    const where: GroupWhereInput = {};

    if (params.filters?.memberId) {
      where.members = {
        some: {
          memberId: { in: params.filters.memberId },
        },
      };
    }

    const orderBy: GroupOrderByWithRelationInput[] = [
      ...params.sort.map(({ field, order }) => ({ [field]: order })),
      { createdAt: 'desc' },
    ];

    return { orderBy, where };
  }

  private toReadModel(
    group: GroupGetPayload<{
      include: {
        members: { include: { member: { include: { user: true } } } };
      };
    }>,
  ): GroupReadModel {
    return {
      createdAt: group.createdAt,
      createdBy: group.createdBy,
      id: group.id,
      members: group.members.map((groupMember) => ({
        category: groupMember.member.category as MemberCategory,
        id: groupMember.memberId,
        name: Name.raw({
          firstName: groupMember.member.user.firstName,
          lastName: groupMember.member.user.lastName,
        }).fullName,
        status: groupMember.member.status as MemberStatus,
      })),
      name: group.name,
      updatedAt: group.updatedAt,
      updatedBy: group.updatedBy,
    };
  }
}
