import { DomainEvent } from '@/shared/domain/events/domain-event';

import { AppSettingEntity } from '../entities/app-setting.entity';

export class AppSettingUpdatedEvent extends DomainEvent {
  public constructor(public readonly appSetting: AppSettingEntity) {
    super(appSetting.id);
  }
}
