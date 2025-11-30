import { Injectable } from '@nestjs/common';

import {
  PaginatedRequestParams,
  PaginatedResponse,
} from '@/domain/shared/types';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { UserRepository } from '@/domain/users/user.repository';
import {
  UserFindManyArgs,
  UserWhereInput,
} from '@/infrastructure/prisma/generated/models';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

import { PrismaUserMapper } from './prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async delete(entity: UserEntity): Promise<void> {
    await this.prismaService.user.delete({
      where: { id: entity.id.value },
    });
  }

  public async findOneById(id: UniqueId): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id.value },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: id.value },
    });

    return PrismaUserMapper.toDomain(user);
  }

  public async findPaginated(
    params: PaginatedRequestParams,
  ): Promise<PaginatedResponse<UserEntity>> {
    const where: UserWhereInput = {};

    const query: UserFindManyArgs = {
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    };

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany(query),
      this.prismaService.user.count({ where }),
    ]);

    return {
      data: users.map((user) => PrismaUserMapper.toDomain(user)),
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

    return PrismaUserMapper.toDomain(user);
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    const user = await this.prismaService.user.upsert({
      create: PrismaUserMapper.toPersistence(entity),
      update: PrismaUserMapper.toPersistence(entity),
      where: { id: entity.id.value },
    });

    return PrismaUserMapper.toDomain(user);
  }
}
