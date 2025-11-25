import { Injectable } from '@nestjs/common';

import {
  PaginatedRequestParams,
  PaginatedResponse,
} from '@/domain/shared/types';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { UserRepository } from '@/domain/users/user.repository';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

import { UserMapper } from './user.mapper';

@Injectable()
export class PrismaUsersRepository implements UserRepository {
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

    return UserMapper.toDomain(user);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: id.value },
    });

    return UserMapper.toDomain(user);
  }

  public findPaginated(
    params: PaginatedRequestParams,
  ): Promise<PaginatedResponse<UserEntity>> {
    return Promise.resolve({
      data: [],
      meta: {
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
        totalPages: 0,
      },
    });
  }

  public async findUniqueByEmail(email: Email): Promise<null | UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email.value },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    const user = await this.prismaService.user.upsert({
      create: UserMapper.toPersistence(entity),
      update: UserMapper.toPersistence(entity),
      where: { id: entity.id.value },
    });

    return UserMapper.toDomain(user);
  }
}
