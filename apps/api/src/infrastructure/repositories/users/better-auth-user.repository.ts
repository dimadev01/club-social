import { Injectable } from '@nestjs/common';

import {
  PaginatedRequestParams,
  PaginatedResponse,
} from '@/domain/shared/types';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { UserRepository } from '@/domain/users/user.repository';
import { BetterAuthService } from '@/infrastructure/auth/better-auth.service';

@Injectable()
export class BetterAuthUserRepository implements UserRepository {
  public constructor(private readonly betterAuthService: BetterAuthService) {}

  public async delete(entity: UserEntity): Promise<void> {
    console.log({ entity });
    throw new Error('Not implemented');
    // await this.prismaService.user.delete({
    //   where: { deletedAt: null, id: entity.id.value },
    // });
  }

  public async findOneById(id: UniqueId): Promise<null | UserEntity> {
    console.log({ id });
    throw new Error('Not implemented');
    // const user = await this.prismaService.user.findUnique({
    //   where: { deletedAt: null, id: id.value },
    // });

    // if (!user) {
    //   return null;
    // }

    // return PrismaUserMapper.toDomain(user);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    console.log({ id });
    throw new Error('Not implemented');
    // const user = await this.prismaService.user.findUniqueOrThrow({
    //   where: { deletedAt: null, id: id.value },
    // });

    // return PrismaUserMapper.toDomain(user);
  }

  public async findPaginated(
    params: PaginatedRequestParams,
  ): Promise<PaginatedResponse<UserEntity>> {
    console.log({ params });
    // throw new Error('Not implemented');

    const data = await this.betterAuthService.auth.api.listUsers({
      query: {},
    });

    console.log({ data });

    return {
      data: [],
      total: 0,
    };

    // return {
    //   data: data.data.map((user) => PrismaUserMapper.toDomain(user)),
    // };

    // const where: UserWhereInput = {};

    // const query: UserFindManyArgs = {
    //   skip: (params.page - 1) * params.pageSize,
    //   take: params.pageSize,
    //   where,
    // };

    // const [users, total] = await Promise.all([
    //   this.prismaService.user.findMany(query),
    //   this.prismaService.user.count({ where }),
    // ]);

    // return {
    //   data: users.map((user) => PrismaUserMapper.toDomain(user)),
    //   total,
    // };
  }

  public async findUniqueByEmail(email: Email): Promise<null | UserEntity> {
    console.log({ email });
    throw new Error('Not implemented');
    // const user = await this.prismaService.user.findUnique({
    //   where: { email: email.value },
    // });

    // if (!user) {
    //   return null;
    // }

    // return PrismaUserMapper.toDomain(user);
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
