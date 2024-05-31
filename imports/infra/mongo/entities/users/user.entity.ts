import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsObject, ValidateNested } from 'class-validator';

import { EntityNewV } from '@infra/mongo/entities/common/entity';
import { UserEmailEntity } from '@infra/mongo/entities/users/user-email.entity';
import { UserProfileEntity } from '@infra/mongo/entities/users/user-profile.entity';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class UserEntity extends EntityNewV {
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
