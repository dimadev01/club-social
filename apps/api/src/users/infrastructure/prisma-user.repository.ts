import {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';
import { UserRole } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';

import {
  UserFindManyArgs,
  UserOrderByWithRelationInput,
  UserWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserEntity } from '../domain/entities/user.entity';
import { UserReadableRepository } from '../domain/user.repository';
import { PrismaUserMapper } from './prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserReadableRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: PrismaUserMapper,
  ) {}

  public async findById(id: UniqueId): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      include: { preferences: true },
      where: { id: id.value },
    });

    if (!user) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }

  public async findByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      include: { preferences: true },
      where: { id: id.value },
    });

    return this.userMapper.toDomain(user);
  }

  public async findByIds(ids: UniqueId[]): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany({
      include: { preferences: true },
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return users.map((user) => this.userMapper.toDomain(user));
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<PaginatedDataResultDto<UserEntity>> {
    const where: UserWhereInput = {};

    if (params.filters?.role) {
      where.role = { in: params.filters.role };
    } else {
      where.role = UserRole.STAFF;
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    const orderBy: UserOrderByWithRelationInput[] = [];

    params.sort.forEach(({ field, order }) => {
      if (field === 'id') {
        orderBy.push({ lastName: order }, { firstName: order });
      } else {
        orderBy.push({ [field]: order });
      }
    });

    const query = {
      include: { preferences: true },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies UserFindManyArgs;

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany(query),
      this.prismaService.user.count({ where }),
    ]);

    return {
      data: users.map((user) => this.userMapper.toDomain(user)),
      total,
    };
  }

  public async findUniqueByEmail(email: Email): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      include: { preferences: true },
      where: { email: email.value },
    });

    if (!user) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }
}
