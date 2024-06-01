import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { IEntity } from '@infra/mongo/entities/common/entity.interface';
import { UserEntity } from '@infra/mongo/entities/users/user.entity';

export interface IMemberEntity extends IEntity {
  address: IMemberAddressEntity;
  birthDate: DateUtcVo | null;
  category: MemberCategoryEnum;
  documentID: string | null;
  fileStatus: MemberFileStatusEnum | null;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
  user: UserEntity | undefined;
  userId: string;
}

export interface IMemberAddressEntity {
  cityGovId: string | null;
  cityName: string | null;
  stateGovId: string | null;
  stateName: string | null;
  street: string | null;
  zipCode: string | null;
}
