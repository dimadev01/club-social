import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsObject, ValidateNested } from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { Entity } from '@infra/mongo/common/entities/entity';
import { UserEmailEntity } from '@infra/mongo/entities/user-email.entity';
import { UserProfileEntity } from '@infra/mongo/entities/user-profile.entity';

export class UserEntity extends Entity {
  @IsNullable()
  @IsDefined()
  public heartbeat: Date | null;

  @ValidateNested({ each: true })
  @Type(() => UserEmailEntity)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public emails: UserEmailEntity[] | null;

  @ValidateNested()
  @Type(() => UserProfileEntity)
  public profile: UserProfileEntity;

  @IsObject()
  @IsDefined()
  public services: Record<string, unknown>;

  public constructor(props: UserEntity) {
    super(props);

    this.profile = props.profile;

    this.emails = props.emails;

    this.services = props.services;

    this.heartbeat = props.heartbeat;
  }
}
