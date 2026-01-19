import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';

import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ADDRESS,
  TEST_ALT_ADDRESS,
  TEST_ALT_BIRTH_DATE,
  TEST_ALT_DOCUMENT_ID,
  TEST_ALT_PHONE,
  TEST_BIRTH_DATE,
  TEST_CREATED_BY,
  TEST_DOCUMENT_ID,
  TEST_PHONE,
} from '@/shared/test/constants';
import {
  createMemberProps,
  createTestMember,
  createTestUser,
} from '@/shared/test/factories';

import { MemberCreatedEvent } from '../events/member-created.event';
import { MemberUpdatedEvent } from '../events/member-updated.event';
import { MemberNotification } from './member-notification';
import { MemberEntity } from './member.entity';

describe('MemberEntity', () => {
  describe('create', () => {
    it('should create a member with valid props', () => {
      const user = createTestUser();
      const props = createMemberProps(user.id);

      const result = MemberEntity.create(props, user);

      expect(result.isOk()).toBe(true);
      const member = result._unsafeUnwrap();
      expect(member.address?.street).toBe(TEST_ADDRESS.street);
      expect(member.birthDate?.value).toBe(TEST_BIRTH_DATE);
      expect(member.category).toBe(MemberCategory.MEMBER);
      expect(member.documentID).toBe(TEST_DOCUMENT_ID);
      expect(member.fileStatus).toBe(FileStatus.COMPLETED);
      expect(member.maritalStatus).toBe(MaritalStatus.SINGLE);
      expect(member.nationality).toBe(MemberNationality.ARGENTINA);
      expect(member.phones).toEqual([TEST_PHONE]);
      expect(member.sex).toBe(MemberSex.MALE);
      expect(member.status).toBe(MemberStatus.ACTIVE);
      expect(member.userId.value).toBe(user.id.value);
      expect(member.createdBy).toBe(user.createdBy);
    });

    it('should add MemberCreatedEvent on creation', () => {
      const user = createTestUser();
      user.pullEvents(); // Clear user events
      const props = createMemberProps(user.id);

      const result = MemberEntity.create(props, user);
      const member = result._unsafeUnwrap();
      const events = member.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MemberCreatedEvent);
      const event = events[0] as MemberCreatedEvent;
      expect(event.member).toBe(member);
      expect(event.user).toBe(user);
    });
  });

  describe('fromPersistence', () => {
    it('should create a member from persisted data', () => {
      const id = UniqueId.generate();
      const userId = UniqueId.generate();

      const member = MemberEntity.fromPersistence(
        {
          address: null,
          birthDate: DateOnly.fromString(TEST_ALT_BIRTH_DATE)._unsafeUnwrap(),
          category: MemberCategory.CADET,
          documentID: TEST_ALT_DOCUMENT_ID,
          fileStatus: FileStatus.PENDING,
          maritalStatus: null,
          nationality: MemberNationality.COLOMBIA,
          notificationPreferences: new MemberNotification(),
          phones: [TEST_ALT_PHONE],
          sex: MemberSex.FEMALE,
          status: MemberStatus.INACTIVE,
          userId,
        },
        {
          audit: {
            createdAt: new Date('2024-01-01'),
            createdBy: TEST_CREATED_BY,
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
      expect(member.createdBy).toBe(TEST_CREATED_BY);
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the member', () => {
      const user = createTestUser();
      const original = createTestMember(user);

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
      const original = createTestMember(user);
      const cloned = original.clone();

      // Modifying original phones shouldn't affect cloned
      original.updateProfile({
        ...createMemberProps(user.id),
        phones: ['+54 11 9999-9999'],
        updatedBy: TEST_CREATED_BY,
      });

      expect(cloned.phones).toEqual([TEST_PHONE]);
    });
  });

  describe('updateProfile', () => {
    it('should update all profile fields', () => {
      const user = createTestUser();
      const member = createTestMember(user);
      member.pullEvents(); // Clear creation event

      const newAddress = Address.create(TEST_ALT_ADDRESS)._unsafeUnwrap();

      member.updateProfile({
        address: newAddress,
        birthDate: DateOnly.fromString(TEST_ALT_BIRTH_DATE)._unsafeUnwrap(),
        category: MemberCategory.ADHERENT_MEMBER,
        documentID: TEST_ALT_DOCUMENT_ID,
        fileStatus: FileStatus.PENDING,
        maritalStatus: MaritalStatus.MARRIED,
        nationality: MemberNationality.UKRAINE,
        notificationPreferences: new MemberNotification(),
        phones: [TEST_ALT_PHONE, '+54 351 765-4321'],
        sex: MemberSex.FEMALE,
        status: MemberStatus.ACTIVE,
        updatedBy: TEST_CREATED_BY,
      });

      expect(member.address?.cityName).toBe(TEST_ALT_ADDRESS.cityName);
      expect(member.birthDate?.value).toBe(TEST_ALT_BIRTH_DATE);
      expect(member.category).toBe(MemberCategory.ADHERENT_MEMBER);
      expect(member.documentID).toBe(TEST_ALT_DOCUMENT_ID);
      expect(member.fileStatus).toBe(FileStatus.PENDING);
      expect(member.maritalStatus).toBe(MaritalStatus.MARRIED);
      expect(member.nationality).toBe(MemberNationality.UKRAINE);
      expect(member.phones).toHaveLength(2);
      expect(member.sex).toBe(MemberSex.FEMALE);
      expect(member.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should add MemberUpdatedEvent when updating', () => {
      const user = createTestUser();
      const member = createTestMember(user);
      member.pullEvents();

      member.updateProfile({
        ...createMemberProps(user.id),
        category: MemberCategory.PRE_CADET,
        updatedBy: TEST_CREATED_BY,
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
      const member = createTestMember(user);

      member.updateProfile({
        address: null,
        birthDate: null,
        category: MemberCategory.MEMBER,
        documentID: null,
        fileStatus: FileStatus.PENDING,
        maritalStatus: null,
        nationality: null,
        notificationPreferences: new MemberNotification(),
        phones: [],
        sex: null,
        status: MemberStatus.ACTIVE,
        updatedBy: TEST_CREATED_BY,
      });

      expect(member.address).toBeNull();
      expect(member.birthDate).toBeNull();
      expect(member.documentID).toBeNull();
      expect(member.maritalStatus).toBeNull();
      expect(member.nationality).toBeNull();
      expect(member.phones).toHaveLength(0);
      expect(member.sex).toBeNull();
      expect(member.status).toBe(MemberStatus.ACTIVE);
      expect(member.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should update notification preferences', () => {
      const user = createTestUser();
      const member = createTestMember(user);

      member.updateProfile({
        ...createMemberProps(user.id),
        notificationPreferences: new MemberNotification({
          notifyOnDueCreated: false,
          notifyOnPaymentMade: true,
        }),
        updatedBy: TEST_CREATED_BY,
      });

      expect(member.notificationPreferences.notifyOnDueCreated).toBe(false);
      expect(member.notificationPreferences.notifyOnPaymentMade).toBe(true);
    });
  });

  describe('notificationPreferences', () => {
    it('should have default notification preferences on creation', () => {
      const user = createTestUser();
      const member = createTestMember(user);

      expect(member.notificationPreferences.notifyOnDueCreated).toBe(true);
      expect(member.notificationPreferences.notifyOnPaymentMade).toBe(true);
    });

    it('should preserve notification preferences when cloning', () => {
      const user = createTestUser();

      const original = createTestMember(user, {
        notificationPreferences: new MemberNotification({
          notifyOnDueCreated: false,
          notifyOnPaymentMade: true,
        }),
      });

      const cloned = original.clone();

      expect(cloned.notificationPreferences.notifyOnDueCreated).toBe(false);
      expect(cloned.notificationPreferences.notifyOnPaymentMade).toBe(true);
    });

    it('should allow partial notification preference updates', () => {
      const user = createTestUser();
      const member = createTestMember(user);

      member.updateProfile({
        ...createMemberProps(user.id),
        notificationPreferences: new MemberNotification({
          notifyOnDueCreated: false,
        }),
        updatedBy: TEST_CREATED_BY,
      });

      expect(member.notificationPreferences.notifyOnDueCreated).toBe(false);
      expect(member.notificationPreferences.notifyOnPaymentMade).toBe(true);
    });
  });
});
