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

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { EntityNewV } from '@infra/mongo/entities/common/entity';
import { MemberAddressEntityNewV } from '@infra/mongo/entities/members/member-address.entity';
import { IMemberEntity } from '@infra/mongo/entities/members/member-entity.interface';
import { IUserEntity } from '@infra/mongo/interfaces/user-entity.interface';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class MemberEntity extends EntityNewV implements IMemberEntity {
  @ValidateNested()
  @Type(() => MemberAddressEntityNewV)
  public address: MemberAddressEntityNewV;

  @IsEnum(MemberCategoryEnum)
  public category: MemberCategoryEnum;

  @IsDate()
  @IsNullable()
  @IsDefined()
  public birthDate: DateUtcVo | null;

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

  public user: IUserEntity | undefined;

  @IsNotEmpty()
  @IsString()
  public userId: string;

  public constructor(props: IMemberEntity) {
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
  }
}
