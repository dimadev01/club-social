import {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';
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

  public async findById(id: UniqueId): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id.value },
    });

    if (!user) {
      return null;
    }

    return this.mapper.user.toDomain(user);
  }

  public async findByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: id.value },
    });

    return this.mapper.user.toDomain(user);
  }

  public async findByIds(ids: UniqueId[]): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        id: { in: ids.map((id) => id.value) },
      },
    });

    return users.map((user) => this.mapper.user.toDomain(user));
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
      where: { email: email.value },
    });

    if (!user) {
      return null;
    }

    return this.mapper.user.toDomain(user);
  }
}
