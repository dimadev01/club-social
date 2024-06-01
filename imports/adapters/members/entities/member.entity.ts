import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Entity } from '@adapters/common/entities/entity';
import { MemberAddressEntity } from '@adapters/members/entities/member-address.entity';
import { IMemberEntity } from '@adapters/members/entities/member-entity.interface';
import { UserEntity } from '@adapters/mongo/entities/user.entity';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class MemberEntity extends Entity implements IMemberEntity {
  @ValidateNested()
  @Type(() => MemberAddressEntity)
  public address: MemberAddressEntity;

  @IsEnum(MemberCategoryEnum)
  public category: MemberCategoryEnum;

  @IsDate()
  @IsNullable()
  @IsDefined()
  public birthDate: Date | null;

  @IsString()
  @IsNullable()
  @IsDefined()
  public documentID: string | null;

  @IsEnum(MemberFileStatusEnum)
  @IsNullable()
  @IsDefined()
  public fileStatus: MemberFileStatusEnum | null;

  @IsEnum(MemberMaritalStatusEnum)
  @IsNullable()
  @IsDefined()
  public maritalStatus: MemberMaritalStatusEnum | null;

  @IsEnum(MemberNationalityEnum)
  @IsNullable()
  @IsDefined()
  public nationality: MemberNationalityEnum | null;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public phones: string[] | null;

  @IsEnum(MemberSexEnum)
  @IsNullable()
  @IsDefined()
  public sex: MemberSexEnum | null;

  @IsEnum(MemberStatusEnum)
  public status: MemberStatusEnum;

  public user: UserEntity | undefined;

  @IsNotEmpty()
  @IsString()
  public userId: string;

  public constructor(props: MemberEntity) {
    super(props);

    this.address = props.address;

    this.category = props.category;

    this.birthDate = props.birthDate;

    this.documentID = props.documentID;

    this.fileStatus = props.fileStatus;

    this.maritalStatus = props.maritalStatus;

    this.nationality = props.nationality;

    this.phones = props.phones;

    this.sex = props.sex;

    this.status = props.status;

    this.userId = props.userId;

    this.user = undefined;
  }
}
