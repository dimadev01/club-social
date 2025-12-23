import {
  ExportRequest,
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';
import { Injectable } from '@nestjs/common';

import {
  MemberFindManyArgs,
  MemberOrderByWithRelationInput,
  MemberWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from '../domain/entities/member.entity';
import { MemberRepository } from '../domain/member.repository';
import {
  FindMembersModelParams,
  MemberDetailModel,
  MemberPaginatedModel,
  MemberSearchParams,
} from '../domain/member.types';

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findAll(
    params: FindMembersModelParams,
  ): Promise<MemberPaginatedModel[]> {
    const members = await this.prismaService.member.findMany({
      include: { user: params.includeUser },
      orderBy: [{ user: { lastName: 'asc' } }, { user: { firstName: 'asc' } }],
      where: { deletedAt: null },
    });

    return members.map((member) => ({
      member: this.mapper.member.toDomain(member),
      user: this.mapper.user.toDomain(member.user),
    }));
  }

  public async findForExport(
    params: ExportRequest,
  ): Promise<MemberPaginatedModel[]> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const members = await this.prismaService.member.findMany({
      include: { user: true },
      orderBy,
      where,
    });

    return members.map((member) => ({
      member: this.mapper.member.toDomain(member),
      user: this.mapper.user.toDomain(member.user),
    }));
  }

  public async findOneModel(id: UniqueId): Promise<MemberDetailModel | null> {
    const member = await this.prismaService.member.findUnique({
      include: { dues: { include: { paymentDues: true } }, user: true },
      where: { deletedAt: null, id: id.value },
    });

    if (!member) {
      return null;
    }

    return {
      dues: member.dues.map((due) => this.mapper.due.toDomain(due)),
      member: this.mapper.member.toDomain(member),
      payments: [],
      user: this.mapper.user.toDomain(member.user),
    };
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<MemberPaginatedModel>> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: { user: true },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies MemberFindManyArgs;

    const [members, total] = await Promise.all([
      this.prismaService.member.findMany(query),
      this.prismaService.member.count({ where }),
    ]);

    return {
      data: members.map((member) => ({
        member: this.mapper.member.toDomain(member),
        user: this.mapper.user.toDomain(member.user),
      })),
      total,
    };
  }

  public async findUniqueById(id: UniqueId): Promise<MemberEntity | null> {
    const member = await this.prismaService.member.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!member) {
      return null;
    }

    return this.mapper.member.toDomain(member);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return members.map((member) => this.mapper.member.toDomain(member));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.member.toDomain(member);
  }

  public async save(entity: MemberEntity): Promise<MemberEntity> {
    const data = this.mapper.member.toPersistence(entity);

    const member = await this.prismaService.member.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.mapper.member.toDomain(member);
  }

  public async search(
    params: MemberSearchParams,
  ): Promise<MemberPaginatedModel[]> {
    const members = await this.prismaService.member.findMany({
      include: { user: true },
      orderBy: [{ user: { lastName: 'asc' } }, { user: { firstName: 'asc' } }],
      take: params.limit,
      where: {
        deletedAt: null,
        OR: [
          {
            user: {
              OR: [
                {
                  firstName: {
                    contains: params.searchTerm,
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: params.searchTerm,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        ],
      },
    });

    return members.map((member) => ({
      member: this.mapper.member.toDomain(member),
      user: this.mapper.user.toDomain(member.user),
    }));
  }

  private buildWhereAndOrderBy(params: ExportRequest): {
    orderBy: MemberOrderByWithRelationInput[];
    where: MemberWhereInput;
  } {
    const where: MemberWhereInput = {
      deletedAt: null,
    };

    if (params.filters?.id) {
      where.id = { in: params.filters.id };
    }

    if (params.filters?.category) {
      where.category = { in: params.filters.category };
    }

    if (params.filters?.userStatus) {
      where.user = { status: { in: params.filters.userStatus } };
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

    return { orderBy, where };
  }
}
