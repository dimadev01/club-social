import {
  AppSettingKey,
  AppSettingScope,
  AppSettingValues,
} from '@club-social/shared/app-settings';

import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { AppSettingUpdatedEvent } from '../events/app-setting-updated.event';
import { AppSettingValidators } from './app-setting.validator';

export interface AppSettingPersistenceMeta {
  updatedAt: Date;
  updatedBy: null | string;
}

export interface AppSettingProps<K extends AppSettingKey> {
  description: null | string;
  key: K;
  scope: AppSettingScope;
  value: AppSettingValues[K];
}

export class AppSettingEntity<
  K extends AppSettingKey = AppSettingKey,
> extends AggregateRoot {
  public get description(): null | string {
    return this._description;
  }

  public get scope(): AppSettingScope {
    return this._scope;
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

  private _description: null | string;
  private _scope: AppSettingScope;
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
    this._scope = props.scope;
    this._updatedAt = meta.updatedAt;
    this._updatedBy = meta.updatedBy;
  }

  public static fromPersistence<K extends AppSettingKey>(
    props: AppSettingProps<K>,
    meta: AppSettingPersistenceMeta,
  ): AppSettingEntity<K> {
    return new AppSettingEntity(props, meta);
  }

  public updateValue(value: unknown, updatedBy: string) {
    const validator = AppSettingValidators[this._id.value as K];

    validator(value);

    this._value = value as AppSettingValues[K];
    this._updatedBy = updatedBy;
    this.addEvent(new AppSettingUpdatedEvent(this));
  }
}
