import { DomainEvent } from '@/shared/domain/events/domain-event';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { AppSettingEntity } from '../entities/app-setting.entity';

export class AppSettingUpdatedEvent extends DomainEvent {
  public constructor(public readonly appSetting: AppSettingEntity) {
    super(UniqueId.raw({ value: appSetting.key }));
  }
}
