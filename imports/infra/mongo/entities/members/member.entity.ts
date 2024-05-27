import { IsNotEmpty, IsString } from 'class-validator';

import { Entity } from '@infra/mongo/entities/common/entity';

export class MemberEntity extends Entity {
  // @ValidateNested()
  // @Type(() => MemberAddress)
  // public address: MemberAddress;

  // @IsEnum(MemberCategoryEnum)
  // public category: MemberCategoryEnum;

  // @IsDate()
  // @IsOptional()
  // public dateOfBirth: Date | null;

  // @IsString()
  // @IsOptional()
  // public documentID: string | null;

  // @IsEnum(MemberFileStatusEnum)
  // @IsOptional()
  // public fileStatus: MemberFileStatusEnum | null;

  // @IsEnum(MemberMaritalStatusEnum)
  // @IsOptional()
  // public maritalStatus: MemberMaritalStatusEnum | null;

  // @IsEnum(MemberNationalityEnum)
  // @IsOptional()
  // public nationality: MemberNationalityEnum | null;

  // @IsString({ each: true })
  // @ArrayMinSize(1)
  // @IsArray()
  // @IsOptional()
  // public phones: string[] | null;

  // @IsEnum(MemberSexEnum)
  // @IsOptional()
  // public sex: MemberSexEnum | null;

  // @IsEnum(MemberStatusEnum)
  // public status: MemberStatusEnum;

  @IsNotEmpty()
  @IsString()
  public userId: string;

  public constructor(props?: MemberEntity) {
    super(props);

    if (props) {
      // this.address = props.address;

      // this.category = props.category;

      // this.dateOfBirth = props.dateOfBirth;

      // this.documentID = props.documentID;

      // this.fileStatus = props.fileStatus;

      // this.maritalStatus = props.maritalStatus;

      // this.nationality = props.nationality;

      // this.phones = props.phones;

      this.userId = props.userId;
    }
  }
}
