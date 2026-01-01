import { UserRole, UserStatus } from '@club-social/shared/users';

import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';

import {
  TEST_CREATED_BY,
  TEST_EMAIL,
  TEST_FIRST_NAME,
  TEST_LAST_NAME,
} from '../constants';

export interface UserPropsOverrides {
  banExpires?: Date | null;
  banned?: boolean | null;
  banReason?: null | string;
  email?: Email;
  name?: Name;
  role?: UserRole;
  status?: UserStatus;
}

export const createUserProps = (overrides?: UserPropsOverrides) => ({
  banExpires: null,
  banned: null,
  banReason: null,
  email: Email.create(TEST_EMAIL)._unsafeUnwrap(),
  name: Name.create({
    firstName: TEST_FIRST_NAME,
    lastName: TEST_LAST_NAME,
  })._unsafeUnwrap(),
  role: UserRole.MEMBER,
  status: UserStatus.ACTIVE,
  ...overrides,
});

export const createTestUser = (overrides?: UserPropsOverrides): UserEntity =>
  UserEntity.create(
    createUserProps(overrides),
    TEST_CREATED_BY,
  )._unsafeUnwrap();
