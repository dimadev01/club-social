import { IUserEntity } from '@adapters/mongo/errors/user-entity.interface';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsObject, ValidateNested } from 'class-validator';

import { Entity } from '@adapters/common/entities/entity';
import { UserEmailEntity } from '@adapters/mongo/entities/user-email.entity';
import { UserProfileEntity } from '@adapters/mongo/entities/user-profile.entity';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class UserEntity extends Entity implements IUserEntity {
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
