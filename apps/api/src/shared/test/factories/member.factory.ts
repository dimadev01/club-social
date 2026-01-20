import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';

import {
  type CreateMemberProps,
  MemberEntity,
} from '@/members/domain/entities/member.entity';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';

import {
  TEST_ADDRESS,
  TEST_BIRTH_DATE,
  TEST_DOCUMENT_ID,
  TEST_PHONE,
} from '../constants';

export const createMemberProps = (
  userId: UniqueId,
  overrides?: Partial<CreateMemberProps>,
) => ({
  address: Address.create(TEST_ADDRESS)._unsafeUnwrap(),
  birthDate: DateOnly.fromString(TEST_BIRTH_DATE)._unsafeUnwrap(),
  category: MemberCategory.MEMBER,
  documentID: TEST_DOCUMENT_ID,
  fileStatus: FileStatus.COMPLETED,
  maritalStatus: MaritalStatus.SINGLE,
  nationality: MemberNationality.ARGENTINA,
  phones: [TEST_PHONE],
  sex: MemberSex.MALE,
  status: MemberStatus.ACTIVE,
  userId,
  ...overrides,
});

export const createTestMember = (
  user: UserEntity,
  overrides?: Partial<CreateMemberProps>,
): MemberEntity =>
  MemberEntity.create(
    createMemberProps(user.id, overrides),
    user,
  )._unsafeUnwrap();
