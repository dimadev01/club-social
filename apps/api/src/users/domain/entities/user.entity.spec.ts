import { UserRole, UserStatus } from '@club-social/shared/users';

import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  const createValidUserProps = () => ({
    banExpires: null,
    banned: null,
    banReason: null,
    email: Email.create('john.doe@example.com')._unsafeUnwrap(),
    name: Name.create({ firstName: 'John', lastName: 'Doe' })._unsafeUnwrap(),
    role: UserRole.MEMBER,
    status: UserStatus.ACTIVE,
  });

  describe('create', () => {
    it('should create a user with valid props', () => {
      const props = createValidUserProps();
      const createdBy = 'admin-123';

      const result = UserEntity.create(props, createdBy);

      expect(result.isOk()).toBe(true);
      const user = result._unsafeUnwrap();
      expect(user.email.value).toBe('john.doe@example.com');
      expect(user.name.firstName).toBe('John');
      expect(user.name.lastName).toBe('Doe');
      expect(user.name.fullName).toBe('Doe John');
      expect(user.role).toBe(UserRole.MEMBER);
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.banned).toBeNull();
      expect(user.banReason).toBeNull();
      expect(user.banExpires).toBeNull();
      expect(user.createdBy).toBe(createdBy);
    });

    it('should create a user with admin role', () => {
      const props = { ...createValidUserProps(), role: UserRole.ADMIN };

      const result = UserEntity.create(props, 'admin');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().role).toBe(UserRole.ADMIN);
    });

    it('should create a user with staff role', () => {
      const props = { ...createValidUserProps(), role: UserRole.STAFF };

      const result = UserEntity.create(props, 'admin');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().role).toBe(UserRole.STAFF);
    });

    it('should create a banned user', () => {
      const banExpires = new Date('2024-12-31');
      const props = {
        ...createValidUserProps(),
        banExpires,
        banned: true,
        banReason: 'Violation of terms',
      };

      const result = UserEntity.create(props, 'admin');

      expect(result.isOk()).toBe(true);
      const user = result._unsafeUnwrap();
      expect(user.banned).toBe(true);
      expect(user.banReason).toBe('Violation of terms');
      expect(user.banExpires).toBe(banExpires);
    });

    it('should add UserCreatedEvent on creation', () => {
      const props = createValidUserProps();

      const result = UserEntity.create(props, 'admin');
      const user = result._unsafeUnwrap();
      const events = user.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserCreatedEvent);
      expect((events[0] as UserCreatedEvent).user).toBe(user);
    });

    it('should generate unique ids for each user', () => {
      const props = createValidUserProps();

      const result1 = UserEntity.create(props, 'admin');
      const result2 = UserEntity.create(props, 'admin');

      expect(result1._unsafeUnwrap().id.value).not.toBe(
        result2._unsafeUnwrap().id.value,
      );
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
          email: Email.raw({ value: 'persisted@example.com' }),
          name: Name.raw({ firstName: 'Jane', lastName: 'Smith' }),
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
        {
          audit: {
            createdAt: new Date('2024-01-01'),
            createdBy: 'system',
            updatedAt: null,
            updatedBy: null,
          },
          deleted: {},
          id,
        },
      );

      expect(user.id).toBe(id);
      expect(user.email.value).toBe('persisted@example.com');
      expect(user.name.firstName).toBe('Jane');
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.createdBy).toBe('system');
    });

    it('should create a soft-deleted user from persisted data', () => {
      const deletedAt = new Date('2024-06-01');

      const user = UserEntity.fromPersistence(
        {
          banExpires: null,
          banned: null,
          banReason: null,
          email: Email.raw({ value: 'deleted@example.com' }),
          name: Name.raw({ firstName: 'Deleted', lastName: 'User' }),
          role: UserRole.MEMBER,
          status: UserStatus.INACTIVE,
        },
        {
          audit: { createdBy: 'admin' },
          deleted: { deletedAt, deletedBy: 'admin' },
          id: UniqueId.generate(),
        },
      );

      expect(user.deletedAt).toBe(deletedAt);
      expect(user.deletedBy).toBe('admin');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the user', () => {
      const props = createValidUserProps();
      const original = UserEntity.create(props, 'admin')._unsafeUnwrap();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.email.value).toBe(original.email.value);
      expect(cloned.name.firstName).toBe(original.name.firstName);
      expect(cloned.name.lastName).toBe(original.name.lastName);
      expect(cloned.role).toBe(original.role);
      expect(cloned.status).toBe(original.status);
    });

    it('should create an independent copy', () => {
      const props = createValidUserProps();
      const original = UserEntity.create(props, 'admin')._unsafeUnwrap();
      const cloned = original.clone();

      original.updateStatus(UserStatus.INACTIVE);

      expect(original.status).toBe(UserStatus.INACTIVE);
      expect(cloned.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('updateEmail', () => {
    it('should update the email', () => {
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();

      const newEmail = Email.create('new.email@example.com')._unsafeUnwrap();
      user.updateEmail(newEmail);

      expect(user.email.value).toBe('new.email@example.com');
    });
  });

  describe('updateName', () => {
    it('should update the name', () => {
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();

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
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();

      user.updateStatus(UserStatus.INACTIVE);

      expect(user.status).toBe(UserStatus.INACTIVE);
    });

    it('should update the status to active', () => {
      const user = UserEntity.fromPersistence(
        { ...createValidUserProps(), status: UserStatus.INACTIVE },
        {
          audit: { createdBy: 'admin' },
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
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();
      user.pullEvents(); // Clear creation event

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
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();
      user.pullEvents();

      user.updateProfile({
        email: Email.create('new@example.com')._unsafeUnwrap(),
        name: Name.create({ firstName: 'New', lastName: 'User' })._unsafeUnwrap(),
        status: UserStatus.ACTIVE,
        updatedBy: 'admin',
      });

      const events = user.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserUpdatedEvent);

      const event = events[0] as UserUpdatedEvent;
      expect(event.oldUser.email.value).toBe('john.doe@example.com');
      expect(event.user.email.value).toBe('new@example.com');
    });
  });

  describe('soft delete', () => {
    it('should delete the user', () => {
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();

      const deleteDate = new Date('2024-06-15');
      user.delete('admin-deleter', deleteDate);

      expect(user.deletedAt).toBe(deleteDate);
      expect(user.deletedBy).toBe('admin-deleter');
    });

    it('should restore a deleted user', () => {
      const user = UserEntity.fromPersistence(
        createValidUserProps(),
        {
          audit: { createdBy: 'admin' },
          deleted: { deletedAt: new Date(), deletedBy: 'admin' },
          id: UniqueId.generate(),
        },
      );

      expect(user.deletedAt).toBeDefined();

      const restoreDate = new Date('2024-07-01');
      user.restore('admin-restorer', restoreDate);

      expect(user.deletedAt).toBeUndefined();
      expect(user.deletedBy).toBeUndefined();
      expect(user.updatedBy).toBe('admin-restorer');
      expect(user.updatedAt).toBe(restoreDate);
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();

      const user1 = UserEntity.fromPersistence(
        {
          banExpires: null,
          banned: null,
          banReason: null,
          email: Email.raw({ value: 'user1@example.com' }),
          name: Name.raw({ firstName: 'User', lastName: 'One' }),
          role: UserRole.MEMBER,
          status: UserStatus.ACTIVE,
        },
        { audit: { createdBy: 'admin' }, deleted: {}, id },
      );

      const user2 = UserEntity.fromPersistence(
        {
          banExpires: null,
          banned: null,
          banReason: null,
          email: Email.raw({ value: 'user2@example.com' }),
          name: Name.raw({ firstName: 'User', lastName: 'Two' }),
          role: UserRole.ADMIN,
          status: UserStatus.INACTIVE,
        },
        { audit: { createdBy: 'system' }, deleted: {}, id },
      );

      expect(user1.equals(user2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const props = createValidUserProps();

      const user1 = UserEntity.create(props, 'admin')._unsafeUnwrap();
      const user2 = UserEntity.create(props, 'admin')._unsafeUnwrap();

      expect(user1.equals(user2)).toBe(false);
    });
  });

  describe('name value object', () => {
    it('should have correct full name formats', () => {
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();

      expect(user.name.fullName).toBe('Doe John');
      expect(user.name.fullNameLastNameFirst).toBe('Doe John');
      expect(user.name.fullNameFirstNameFirst).toBe('John Doe');
    });
  });

  describe('email value object', () => {
    it('should have correct email methods', () => {
      const user = UserEntity.create(
        createValidUserProps(),
        'admin',
      )._unsafeUnwrap();

      expect(user.email.local()).toBe('john.doe');
      expect(user.email.domain()).toBe('example.com');
      expect(user.email.toString()).toBe('john.doe@example.com');
    });
  });

  describe('different roles', () => {
    const roles = Object.values(UserRole);

    it.each(roles)('should create user with role %s', (role) => {
      const props = { ...createValidUserProps(), role };

      const result = UserEntity.create(props, 'admin');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().role).toBe(role);
    });
  });

  describe('different statuses', () => {
    const statuses = Object.values(UserStatus);

    it.each(statuses)('should create user with status %s', (status) => {
      const props = { ...createValidUserProps(), status };

      const result = UserEntity.create(props, 'admin');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().status).toBe(status);
    });
  });
});
