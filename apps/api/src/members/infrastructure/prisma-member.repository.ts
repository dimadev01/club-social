import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';
import { Injectable } from '@nestjs/common';

import {
  MemberFindManyArgs,
  MemberWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from '../domain/entities/member.entity';
import { MemberRepository } from '../domain/member.repository';
import { PrismaMemberMapper } from './prisma-member.mapper';

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMemberMapper,
  ) {}

  public async findManyByIds(ids: UniqueId[]): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return members.map((member) => this.mapper.toDomain(member));
  }

  public async findOneById(id: UniqueId): Promise<MemberEntity | null> {
    const member = await this.prismaService.member.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!member) {
      return null;
    }

    return this.mapper.toDomain(member);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.toDomain(member);
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<MemberEntity>> {
    const where: MemberWhereInput = {
      deletedAt: null,
    };

    const query: MemberFindManyArgs = {
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    };

    const [members, total] = await Promise.all([
      this.prismaService.member.findMany(query),
      this.prismaService.member.count({ where }),
    ]);

    return {
      data: members.map((member) => this.mapper.toDomain(member)),
      total,
    };
  }

  public async save(entity: MemberEntity): Promise<MemberEntity> {
    const data = this.mapper.toPersistence(entity);

    const member = await this.prismaService.member.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return this.mapper.toDomain(member);
  }
}
