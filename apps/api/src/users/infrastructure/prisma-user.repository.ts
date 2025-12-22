import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';
import { UserRole } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';

import {
  UserFindManyArgs,
  UserWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserEntity } from '../domain/entities/user.entity';
import { UserReadableRepository } from '../domain/user.repository';

@Injectable()
export class PrismaUserRepository implements UserReadableRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<UserEntity>> {
    const where: UserWhereInput = {
      deletedAt: null,
    };

    if (params.filters?.role) {
      where.role = { in: params.filters.role };
    } else {
      where.role = UserRole.STAFF;
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    const query: UserFindManyArgs = {
      orderBy: params.sort.map(({ field, order }) => ({ [field]: order })),
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    };

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany(query),
      this.prismaService.user.count({ where }),
    ]);

    return {
      data: users.map((user) => this.mapper.user.toDomain(user)),
      total,
    };
  }

  public async findUniqueByEmail(email: Email): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { deletedAt: null, email: email.value },
    });

    if (!user) {
      return null;
    }

    return this.mapper.user.toDomain(user);
  }

  public async findUniqueById(id: UniqueId): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!user) {
      return null;
    }

    return this.mapper.user.toDomain(user);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return users.map((user) => this.mapper.user.toDomain(user));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<UserEntity> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.user.toDomain(user);
  }
}
