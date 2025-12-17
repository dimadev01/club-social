import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';
import { Injectable } from '@nestjs/common';

import {
  MemberFindManyArgs,
  MemberOrderByWithRelationInput,
  MemberWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Guard } from '@/shared/domain/guards';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { PrismaUserMapper } from '@/users/infrastructure/prisma-user.mapper';

import { MemberEntity } from '../domain/entities/member.entity';
import { MemberRepository } from '../domain/member.repository';
import { FindMembersModelParams, MemberModel } from '../domain/member.types';
import { PrismaMemberMapper } from './prisma-member.mapper';

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly memberMapper: PrismaMemberMapper,
    private readonly userMapper: PrismaUserMapper,
  ) {}

  public async findAll(params: FindMembersModelParams): Promise<MemberModel[]> {
    const members = await this.prismaService.member.findMany({
      include: { user: params.includeUser },
      orderBy: [{ user: { lastName: 'asc' } }, { user: { firstName: 'asc' } }],
      where: { deletedAt: null },
    });

    return members.map((member) => {
      Guard.defined(member.user);

      return {
        member: this.memberMapper.toDomain(member),
        user: this.userMapper.toDomain(member.user),
      };
    });
  }

  public async findManyByIds(ids: UniqueId[]): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return members.map((member) => this.memberMapper.toDomain(member));
  }

  public async findOneById(id: UniqueId): Promise<MemberEntity | null> {
    const member = await this.prismaService.member.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!member) {
      return null;
    }

    return this.memberMapper.toDomain(member);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.memberMapper.toDomain(member);
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<MemberEntity>> {
    const where: MemberWhereInput = {
      deletedAt: null,
    };

    if (params.filters?.id) {
      where.id = { in: params.filters.id };
    }

    if (params.filters?.category) {
      where.category = { in: params.filters.category };
    }

    if (params.filters?.status) {
      where.user = { status: { in: params.filters.status } };
    }

    const orderBy: MemberOrderByWithRelationInput[] = [];

    params.sort.forEach(({ field, order }) => {
      if (field === 'email') {
        orderBy.push({ user: { email: order } });
      } else if (field === 'id') {
        orderBy.push(
          { user: { lastName: order } },
          { user: { firstName: order } },
        );
      } else {
        orderBy.push({ [field]: order });
      }
    });

    const query: MemberFindManyArgs = {
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    };

    const [members, total] = await Promise.all([
      this.prismaService.member.findMany(query),
      this.prismaService.member.count({ where }),
    ]);

    return {
      data: members.map((member) => this.memberMapper.toDomain(member)),
      total,
    };
  }

  public async save(entity: MemberEntity): Promise<MemberEntity> {
    const data = this.memberMapper.toPersistence(entity);

    const member = await this.prismaService.member.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.memberMapper.toDomain(member);
  }
}
