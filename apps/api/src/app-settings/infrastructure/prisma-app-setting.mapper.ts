import type { InputJsonValue } from '@prisma/client/runtime/client';

import { Injectable } from '@nestjs/common';

import {
  AppSettingModel,
  AppSettingUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';

import { AppSettingKey, AppSettingValues } from '../domain/app-setting.types';
import { AppSettingEntity } from '../domain/entities/app-setting.entity';

@Injectable()
export class PrismaAppSettingMapper {
  public toDomain<K extends AppSettingKey>(
    model: AppSettingModel,
  ): AppSettingEntity<K> {
    return AppSettingEntity.fromPersistence<K>(
      {
        description: model.description,
        key: model.key as K,
        value: model.value as unknown as AppSettingValues[K],
      },
      {
        updatedAt: model.updatedAt,
        updatedBy: model.updatedBy,
      },
    );
  }

  public toUpdateInput(entity: AppSettingEntity): AppSettingUpdateInput {
    return {
      updatedBy: entity.updatedBy,
      value: entity.value as unknown as InputJsonValue,
    };
  }
}
