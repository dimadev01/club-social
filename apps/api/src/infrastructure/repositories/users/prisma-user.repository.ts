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
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

import { PrismaUserMapper } from './prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaUserMapper,
  ) {}

  public async delete(entity: UserEntity): Promise<void> {
    console.log({ entity });
    throw new Error('Not implemented');
    // await this.prismaService.user.delete({
    //   where: { deletedAt: null, id: entity.id.value },
    // });
  }

  public async findOneById(id: UniqueId): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.toDomain(user);
  }

  public async findPaginated(
    params: PaginatedRequestParams,
  ): Promise<PaginatedResponse<UserEntity>> {
    const where: UserWhereInput = {
      deletedAt: null,
    };

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
      data: users.map((user) => this.mapper.toDomain(user)),
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

    return this.mapper.toDomain(user);
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    console.log({ entity });
    throw new Error('Not implemented');
    // const user = await this.prismaService.user.upsert({
    //   create: PrismaUserMapper.toPersistence(entity),
    //   update: PrismaUserMapper.toPersistence(entity),
    //   where: { id: entity.id.value },
    // });

    // return PrismaUserMapper.toDomain(user);
  }
}
