import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { AppSettingKey, AppSettingValues } from '../app-setting.types';
import { AppSettingUpdatedEvent } from '../events/app-setting-updated.event';

interface AppSettingPersistenceMeta {
  updatedAt: Date;
  updatedBy: null | string;
}

interface AppSettingProps<K extends AppSettingKey> {
  description: null | string;
  key: K;
  value: AppSettingValues[K];
}

export class AppSettingEntity<
  K extends AppSettingKey = AppSettingKey,
> extends AggregateRoot {
  public get description(): null | string {
    return this._description;
  }

  public get key(): K {
    return this._key;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get updatedBy(): null | string {
    return this._updatedBy;
  }

  public get value(): AppSettingValues[K] {
    return this._value;
  }

  private readonly _description: null | string;
  private readonly _key: K;
  private _updatedAt: Date;
  private _updatedBy: null | string;
  private _value: AppSettingValues[K];

  private constructor(
    props: AppSettingProps<K>,
    meta: AppSettingPersistenceMeta,
  ) {
    super(UniqueId.raw({ value: props.key }));

    this._value = props.value;
    this._description = props.description;
    this._updatedAt = meta.updatedAt;
    this._updatedBy = meta.updatedBy;
  }

  public static fromPersistence<K extends AppSettingKey>(
    props: AppSettingProps<K>,
    meta: AppSettingPersistenceMeta,
  ): AppSettingEntity<K> {
    return new AppSettingEntity(props, meta);
  }

  public updateValue(value: AppSettingValues[K], updatedBy: string): void {
    this._value = value;
    this._updatedBy = updatedBy;
    this._updatedAt = new Date();

    this.addEvent(new AppSettingUpdatedEvent(this));
  }
}
