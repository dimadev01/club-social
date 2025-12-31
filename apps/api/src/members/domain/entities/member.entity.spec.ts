import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';
import { UserRole, UserStatus } from '@club-social/shared/users';

import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { MemberCreatedEvent } from '../events/member-created.event';
import { MemberUpdatedEvent } from '../events/member-updated.event';
import { MemberEntity } from './member.entity';

describe('MemberEntity', () => {
  const createTestUser = () =>
    UserEntity.create(
      {
        banExpires: null,
        banned: null,
        banReason: null,
        email: Email.create('test@example.com')._unsafeUnwrap(),
        name: Name.create({
          firstName: 'John',
          lastName: 'Doe',
        })._unsafeUnwrap(),
        role: UserRole.MEMBER,
        status: UserStatus.ACTIVE,
      },
      'admin',
    )._unsafeUnwrap();

  const createValidMemberProps = (userId: UniqueId) => ({
    address: Address.create({
      cityName: 'Buenos Aires',
      stateName: 'CABA',
      street: 'Av. Corrientes 1234',
      zipCode: '1000',
    })._unsafeUnwrap(),
    birthDate: DateOnly.fromString('1990-05-15')._unsafeUnwrap(),
    category: MemberCategory.MEMBER,
    documentID: '12345678',
    fileStatus: FileStatus.COMPLETED,
    maritalStatus: MaritalStatus.SINGLE,
    nationality: MemberNationality.ARGENTINA,
    phones: ['+54 11 1234-5678'],
    sex: MemberSex.MALE,
    userId,
  });

  describe('create', () => {
    it('should create a member with valid props', () => {
      const user = createTestUser();
      const props = createValidMemberProps(user.id);

      const result = MemberEntity.create(props, user);

      expect(result.isOk()).toBe(true);
      const member = result._unsafeUnwrap();
      expect(member.address?.street).toBe('Av. Corrientes 1234');
      expect(member.birthDate?.value).toBe('1990-05-15');
      expect(member.category).toBe(MemberCategory.MEMBER);
      expect(member.documentID).toBe('12345678');
      expect(member.fileStatus).toBe(FileStatus.COMPLETED);
      expect(member.maritalStatus).toBe(MaritalStatus.SINGLE);
      expect(member.nationality).toBe(MemberNationality.ARGENTINA);
      expect(member.phones).toEqual(['+54 11 1234-5678']);
      expect(member.sex).toBe(MemberSex.MALE);
      expect(member.status).toBe(MemberStatus.ACTIVE);
      expect(member.userId.value).toBe(user.id.value);
      expect(member.createdBy).toBe(user.createdBy);
    });

    it('should create a member with null optional props', () => {
      const user = createTestUser();
      const props = {
        address: null,
        birthDate: null,
        category: MemberCategory.ADHERENT_MEMBER,
        documentID: null,
        fileStatus: FileStatus.PENDING,
        maritalStatus: null,
        nationality: null,
        phones: [],
        sex: null,
        userId: user.id,
      };

      const result = MemberEntity.create(props, user);

      expect(result.isOk()).toBe(true);
      const member = result._unsafeUnwrap();
      expect(member.address).toBeNull();
      expect(member.birthDate).toBeNull();
      expect(member.documentID).toBeNull();
      expect(member.maritalStatus).toBeNull();
      expect(member.nationality).toBeNull();
      expect(member.phones).toHaveLength(0);
      expect(member.sex).toBeNull();
    });

    it('should add MemberCreatedEvent on creation', () => {
      const user = createTestUser();
      user.pullEvents(); // Clear user events
      const props = createValidMemberProps(user.id);

      const result = MemberEntity.create(props, user);
      const member = result._unsafeUnwrap();
      const events = member.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MemberCreatedEvent);
      const event = events[0] as MemberCreatedEvent;
      expect(event.member).toBe(member);
      expect(event.user).toBe(user);
    });

    it('should generate a unique id', () => {
      const user = createTestUser();
      const props = createValidMemberProps(user.id);

      const result1 = MemberEntity.create(props, user);
      const result2 = MemberEntity.create(props, user);

      expect(result1._unsafeUnwrap().id.value).not.toBe(
        result2._unsafeUnwrap().id.value,
      );
    });
  });

  describe('fromPersistence', () => {
    it('should create a member from persisted data', () => {
      const id = UniqueId.generate();
      const userId = UniqueId.generate();

      const member = MemberEntity.fromPersistence(
        {
          address: null,
          birthDate: DateOnly.fromString('1985-03-20')._unsafeUnwrap(),
          category: MemberCategory.CADET,
          documentID: '87654321',
          fileStatus: FileStatus.PENDING,
          maritalStatus: null,
          nationality: MemberNationality.COLOMBIA,
          phones: ['+57 300 123 4567'],
          sex: MemberSex.FEMALE,
          status: MemberStatus.INACTIVE,
          userId,
        },
        {
          audit: {
            createdAt: new Date('2024-01-01'),
            createdBy: 'admin',
            updatedAt: null,
            updatedBy: null,
          },
          id,
        },
      );

      expect(member.id).toBe(id);
      expect(member.userId).toBe(userId);
      expect(member.category).toBe(MemberCategory.CADET);
      expect(member.status).toBe(MemberStatus.INACTIVE);
      expect(member.createdBy).toBe('admin');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the member', () => {
      const user = createTestUser();
      const props = createValidMemberProps(user.id);
      const original = MemberEntity.create(props, user)._unsafeUnwrap();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.userId.value).toBe(original.userId.value);
      expect(cloned.category).toBe(original.category);
      expect(cloned.status).toBe(original.status);
      expect(cloned.documentID).toBe(original.documentID);
      expect(cloned.phones).toEqual(original.phones);
    });

    it('should create an independent copy of phones array', () => {
      const user = createTestUser();
      const props = createValidMemberProps(user.id);
      const original = MemberEntity.create(props, user)._unsafeUnwrap();
      const cloned = original.clone();

      // Modifying original phones shouldn't affect cloned
      original.updateProfile({
        ...props,
        phones: ['+54 11 9999-9999'],
        updatedBy: 'admin',
      });

      expect(cloned.phones).toEqual(['+54 11 1234-5678']);
    });
  });

  describe('updateProfile', () => {
    it('should update all profile fields', () => {
      const user = createTestUser();
      const props = createValidMemberProps(user.id);
      const member = MemberEntity.create(props, user)._unsafeUnwrap();
      member.pullEvents(); // Clear creation event

      const newAddress = Address.create({
        cityName: 'Córdoba',
        stateName: 'Córdoba',
        street: 'Av. Colón 500',
        zipCode: '5000',
      })._unsafeUnwrap();

      member.updateProfile({
        address: newAddress,
        birthDate: DateOnly.fromString('1985-12-25')._unsafeUnwrap(),
        category: MemberCategory.ADHERENT_MEMBER,
        documentID: '99999999',
        fileStatus: FileStatus.PENDING,
        maritalStatus: MaritalStatus.MARRIED,
        nationality: MemberNationality.UKRAINE,
        phones: ['+54 351 123-4567', '+54 351 765-4321'],
        sex: MemberSex.FEMALE,
        updatedBy: 'admin',
      });

      expect(member.address?.cityName).toBe('Córdoba');
      expect(member.birthDate?.value).toBe('1985-12-25');
      expect(member.category).toBe(MemberCategory.ADHERENT_MEMBER);
      expect(member.documentID).toBe('99999999');
      expect(member.fileStatus).toBe(FileStatus.PENDING);
      expect(member.maritalStatus).toBe(MaritalStatus.MARRIED);
      expect(member.nationality).toBe(MemberNationality.UKRAINE);
      expect(member.phones).toHaveLength(2);
      expect(member.sex).toBe(MemberSex.FEMALE);
      expect(member.updatedBy).toBe('admin');
    });

    it('should add MemberUpdatedEvent when updating', () => {
      const user = createTestUser();
      const props = createValidMemberProps(user.id);
      const member = MemberEntity.create(props, user)._unsafeUnwrap();
      member.pullEvents();

      member.updateProfile({
        ...props,
        category: MemberCategory.PRE_CADET,
        updatedBy: 'admin',
      });

      const events = member.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MemberUpdatedEvent);

      const event = events[0] as MemberUpdatedEvent;
      expect(event.oldMember.category).toBe(MemberCategory.MEMBER);
      expect(event.member.category).toBe(MemberCategory.PRE_CADET);
    });

    it('should update to null values', () => {
      const user = createTestUser();
      const props = createValidMemberProps(user.id);
      const member = MemberEntity.create(props, user)._unsafeUnwrap();

      member.updateProfile({
        address: null,
        birthDate: null,
        category: MemberCategory.MEMBER,
        documentID: null,
        fileStatus: FileStatus.PENDING,
        maritalStatus: null,
        nationality: null,
        phones: [],
        sex: null,
        updatedBy: 'admin',
      });

      expect(member.address).toBeNull();
      expect(member.birthDate).toBeNull();
      expect(member.documentID).toBeNull();
      expect(member.maritalStatus).toBeNull();
      expect(member.nationality).toBeNull();
      expect(member.phones).toHaveLength(0);
      expect(member.sex).toBeNull();
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();
      const userId = UniqueId.generate();

      const member1 = MemberEntity.fromPersistence(
        {
          address: null,
          birthDate: null,
          category: MemberCategory.MEMBER,
          documentID: null,
          fileStatus: FileStatus.PENDING,
          maritalStatus: null,
          nationality: null,
          phones: [],
          sex: null,
          status: MemberStatus.ACTIVE,
          userId,
        },
        { audit: { createdBy: 'user' }, id },
      );

      const member2 = MemberEntity.fromPersistence(
        {
          address: null,
          birthDate: null,
          category: MemberCategory.CADET,
          documentID: '12345',
          fileStatus: FileStatus.COMPLETED,
          maritalStatus: MaritalStatus.MARRIED,
          nationality: MemberNationality.BULGARIA,
          phones: ['123'],
          sex: MemberSex.MALE,
          status: MemberStatus.INACTIVE,
          userId,
        },
        { audit: { createdBy: 'admin' }, id },
      );

      expect(member1.equals(member2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const userId = UniqueId.generate();
      const baseProps = {
        address: null,
        birthDate: null,
        category: MemberCategory.MEMBER,
        documentID: null,
        fileStatus: FileStatus.PENDING,
        maritalStatus: null,
        nationality: null,
        phones: [],
        sex: null,
        status: MemberStatus.ACTIVE,
        userId,
      };

      const member1 = MemberEntity.fromPersistence(baseProps, {
        audit: { createdBy: 'user' },
        id: UniqueId.generate(),
      });

      const member2 = MemberEntity.fromPersistence(baseProps, {
        audit: { createdBy: 'user' },
        id: UniqueId.generate(),
      });

      expect(member1.equals(member2)).toBe(false);
    });
  });

  describe('different categories', () => {
    const categories = Object.values(MemberCategory);

    it.each(categories)('should create member with category %s', (category) => {
      const user = createTestUser();
      const props = {
        ...createValidMemberProps(user.id),
        category,
      };

      const result = MemberEntity.create(props, user);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().category).toBe(category);
    });
  });

  describe('multiple phones', () => {
    it('should handle multiple phone numbers', () => {
      const user = createTestUser();
      const phones = [
        '+54 11 1111-1111',
        '+54 11 2222-2222',
        '+54 11 3333-3333',
      ];
      const props = {
        ...createValidMemberProps(user.id),
        phones,
      };

      const result = MemberEntity.create(props, user);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().phones).toEqual(phones);
    });
  });
});
