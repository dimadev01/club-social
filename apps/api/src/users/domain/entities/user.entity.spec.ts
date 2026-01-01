import { UserRole, UserStatus } from '@club-social/shared/users';

import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ALT_EMAIL,
  TEST_ALT_FIRST_NAME,
  TEST_ALT_LAST_NAME,
  TEST_CREATED_BY,
  TEST_EMAIL,
  TEST_FIRST_NAME,
  TEST_LAST_NAME,
} from '@/shared/test/constants';
import { createTestUser, createUserProps } from '@/shared/test/factories';

import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  describe('create', () => {
    it('should create a user with valid props', () => {
      const props = createUserProps();

      const result = UserEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const user = result._unsafeUnwrap();
      expect(user.email.value).toBe(TEST_EMAIL);
      expect(user.name.firstName).toBe(TEST_FIRST_NAME);
      expect(user.name.lastName).toBe(TEST_LAST_NAME);
      expect(user.name.fullNameFirstNameFirst).toBe(
        `${TEST_FIRST_NAME} ${TEST_LAST_NAME}`,
      );
      expect(user.name.fullNameLastNameFirst).toBe(
        `${TEST_LAST_NAME} ${TEST_FIRST_NAME}`,
      );
      expect(user.role).toBe(UserRole.MEMBER);
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.banned).toBeNull();
      expect(user.banReason).toBeNull();
      expect(user.banExpires).toBeNull();
      expect(user.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a user with admin role using overrides', () => {
      const user = createTestUser({ role: UserRole.ADMIN });

      expect(user.role).toBe(UserRole.ADMIN);
    });

    it('should create a user with staff role using overrides', () => {
      const user = createTestUser({ role: UserRole.STAFF });

      expect(user.role).toBe(UserRole.STAFF);
    });

    it('should create a banned user using overrides', () => {
      const banExpires = new Date('2024-12-31');

      const user = createTestUser({
        banExpires,
        banned: true,
        banReason: 'Violation of terms',
      });

      expect(user.banned).toBe(true);
      expect(user.banReason).toBe('Violation of terms');
      expect(user.banExpires).toBe(banExpires);
    });

    it('should add UserCreatedEvent on creation', () => {
      const user = createTestUser();

      const events = user.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserCreatedEvent);
      expect((events[0] as UserCreatedEvent).user).toBe(user);
    });

    it('should generate unique ids for each user', () => {
      const user1 = createTestUser();
      const user2 = createTestUser();

      expect(user1.id.value).not.toBe(user2.id.value);
    });
  });

  describe('fromPersistence', () => {
    it('should create a user from persisted data', () => {
      const id = UniqueId.generate();

      const user = UserEntity.fromPersistence(
        {
          banExpires: null,
          banned: null,
          banReason: null,
          email: Email.raw({ value: TEST_ALT_EMAIL }),
          name: Name.raw({
            firstName: TEST_ALT_FIRST_NAME,
            lastName: TEST_ALT_LAST_NAME,
          }),
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
        {
          audit: {
            createdAt: new Date('2024-01-01'),
            createdBy: TEST_CREATED_BY,
            updatedAt: null,
            updatedBy: null,
          },
          deleted: {},
          id,
        },
      );

      expect(user.id).toBe(id);
      expect(user.email.value).toBe(TEST_ALT_EMAIL);
      expect(user.name.firstName).toBe(TEST_ALT_FIRST_NAME);
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a soft-deleted user from persisted data', () => {
      const deletedAt = new Date('2024-06-01');

      const user = UserEntity.fromPersistence(
        {
          banExpires: null,
          banned: null,
          banReason: null,
          email: Email.raw({ value: TEST_ALT_EMAIL }),
          name: Name.raw({
            firstName: TEST_ALT_FIRST_NAME,
            lastName: TEST_ALT_LAST_NAME,
          }),
          role: UserRole.MEMBER,
          status: UserStatus.INACTIVE,
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          deleted: { deletedAt, deletedBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      expect(user.deletedAt).toBe(deletedAt);
      expect(user.deletedBy).toBe(TEST_CREATED_BY);
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the user', () => {
      const original = createTestUser();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.email.value).toBe(original.email.value);
      expect(cloned.name.firstName).toBe(original.name.firstName);
      expect(cloned.name.lastName).toBe(original.name.lastName);
      expect(cloned.role).toBe(original.role);
      expect(cloned.status).toBe(original.status);
    });

    it('should create an independent copy', () => {
      const original = createTestUser();
      const cloned = original.clone();

      original.updateStatus(UserStatus.INACTIVE);

      expect(original.status).toBe(UserStatus.INACTIVE);
      expect(cloned.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('updateEmail', () => {
    it('should update the email', () => {
      const user = createTestUser();

      const newEmail = Email.create('new.email@example.com')._unsafeUnwrap();
      user.updateEmail(newEmail);

      expect(user.email.value).toBe('new.email@example.com');
    });
  });

  describe('updateName', () => {
    it('should update the name', () => {
      const user = createTestUser();

      const newName = Name.create({
        firstName: 'Jane',
        lastName: 'Smith',
      })._unsafeUnwrap();
      user.updateName(newName);

      expect(user.name.firstName).toBe('Jane');
      expect(user.name.lastName).toBe('Smith');
    });
  });

  describe('updateStatus', () => {
    it('should update the status to inactive', () => {
      const user = createTestUser();

      user.updateStatus(UserStatus.INACTIVE);

      expect(user.status).toBe(UserStatus.INACTIVE);
    });

    it('should update the status to active using overrides', () => {
      const user = UserEntity.fromPersistence(
        createUserProps({ status: UserStatus.INACTIVE }),
        {
          audit: { createdBy: TEST_CREATED_BY },
          deleted: {},
          id: UniqueId.generate(),
        },
      );

      user.updateStatus(UserStatus.ACTIVE);

      expect(user.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('updateProfile', () => {
    it('should update email, name, and status', () => {
      const user = createTestUser();
      user.pullEvents();

      const newEmail = Email.create('updated@example.com')._unsafeUnwrap();

      const newName = Name.create({
        firstName: 'Updated',
        lastName: 'Name',
      })._unsafeUnwrap();

      user.updateProfile({
        email: newEmail,
        name: newName,
        status: UserStatus.INACTIVE,
        updatedBy: 'admin-updater',
      });

      expect(user.email.value).toBe('updated@example.com');
      expect(user.name.firstName).toBe('Updated');
      expect(user.name.lastName).toBe('Name');
      expect(user.status).toBe(UserStatus.INACTIVE);
      expect(user.updatedBy).toBe('admin-updater');
    });

    it('should add UserUpdatedEvent when updating profile', () => {
      const user = createTestUser();
      user.pullEvents();

      user.updateProfile({
        email: Email.create('new@example.com')._unsafeUnwrap(),
        name: Name.create({
          firstName: 'New',
          lastName: 'User',
        })._unsafeUnwrap(),
        status: UserStatus.ACTIVE,
        updatedBy: TEST_CREATED_BY,
      });

      const events = user.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserUpdatedEvent);

      const event = events[0] as UserUpdatedEvent;
      expect(event.oldUser.email.value).toBe(TEST_EMAIL);
      expect(event.user.email.value).toBe('new@example.com');
    });
  });
});
