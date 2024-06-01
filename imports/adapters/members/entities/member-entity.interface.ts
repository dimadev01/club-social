import { IEntity } from '@adapters/common/entities/entity.interface';
import { UserEntity } from '@adapters/mongo/entities/user.entity';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface IMemberEntity extends IEntity {
  address: IMemberAddressEntity;
  birthDate: Date | null;
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
