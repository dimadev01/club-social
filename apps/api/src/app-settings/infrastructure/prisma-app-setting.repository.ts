import {
  AppSettingKey,
  AppSettingScope,
} from '@club-social/shared/app-settings';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

import { AppSettingRepository } from '../domain/app-setting.repository';
import { AppSettingEntity } from '../domain/entities/app-setting.entity';
import { PrismaAppSettingMapper } from './prisma-app-setting.mapper';

@Injectable()
export class PrismaAppSettingRepository implements AppSettingRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaAppSettingMapper,
  ) {}

  public async findAll(): Promise<AppSettingEntity[]> {
    const settings = await this.prismaService.appSetting.findMany({
      orderBy: { id: 'asc' },
    });

    return settings.map((setting) => this.mapper.toDomain(setting));
  }

  public async findByKeyOrThrow<K extends AppSettingKey>(
    key: K,
  ): Promise<AppSettingEntity<K>> {
    const setting = await this.prismaService.appSetting.findUniqueOrThrow({
      where: { id: key },
    });

    return this.mapper.toDomain<K>(setting);
  }

  public async findByScopes(
    scopes: AppSettingScope[],
  ): Promise<AppSettingEntity[]> {
    const settings = await this.prismaService.appSetting.findMany({
      orderBy: { id: 'asc' },
      where: { scope: { in: scopes } },
    });

    return settings.map((setting) => this.mapper.toDomain(setting));
  }

  public async save(entity: AppSettingEntity): Promise<void> {
    const update = this.mapper.toUpdateInput(entity);

    await this.prismaService.appSetting.update({
      data: update,
      where: { id: entity.id.value },
    });
  }
}
