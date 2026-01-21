import { UserRole } from '@club-social/shared/users';

import { UserNotification } from './user-notification';

describe('UserNotification', () => {
  describe('forRole', () => {
    describe('with UserRole.STAFF', () => {
      it('should create notification preferences with staff defaults when no props are provided', () => {
        const notification = UserNotification.forRole(UserRole.STAFF);

        expect(notification.notifyOnDueCreated).toBe(false);
        expect(notification.notifyOnMemberCreated).toBe(false);
        expect(notification.notifyOnMovementCreated).toBe(false);
        expect(notification.notifyOnMovementVoided).toBe(false);
        expect(notification.notifyOnPaymentCreated).toBe(false);
      });

      it('should create notification preferences using overrides', () => {
        const notification = UserNotification.forRole(UserRole.STAFF, {
          notifyOnMemberCreated: true,
          notifyOnMovementCreated: true,
        });

        expect(notification.notifyOnDueCreated).toBe(false);
        expect(notification.notifyOnMemberCreated).toBe(true);
        expect(notification.notifyOnMovementCreated).toBe(true);
        expect(notification.notifyOnMovementVoided).toBe(false);
        expect(notification.notifyOnPaymentCreated).toBe(false);
      });
    });

    describe('with UserRole.ADMIN', () => {
      it('should create notification preferences with admin defaults when no props are provided', () => {
        const notification = UserNotification.forRole(UserRole.ADMIN);

        expect(notification.notifyOnDueCreated).toBe(false);
        expect(notification.notifyOnMemberCreated).toBe(false);
        expect(notification.notifyOnMovementCreated).toBe(false);
        expect(notification.notifyOnMovementVoided).toBe(false);
        expect(notification.notifyOnPaymentCreated).toBe(false);
      });
    });

    describe('with UserRole.MEMBER', () => {
      it('should create notification preferences with member defaults when no props are provided', () => {
        const notification = UserNotification.forRole(UserRole.MEMBER);

        expect(notification.notifyOnDueCreated).toBe(true);
        expect(notification.notifyOnMemberCreated).toBe(false);
        expect(notification.notifyOnMovementCreated).toBe(false);
        expect(notification.notifyOnMovementVoided).toBe(false);
        expect(notification.notifyOnPaymentCreated).toBe(true);
      });

      it('should create notification preferences using overrides', () => {
        const notification = UserNotification.forRole(UserRole.MEMBER, {
          notifyOnDueCreated: false,
          notifyOnMovementCreated: true,
        });

        expect(notification.notifyOnDueCreated).toBe(false);
        expect(notification.notifyOnMemberCreated).toBe(false);
        expect(notification.notifyOnMovementCreated).toBe(true);
        expect(notification.notifyOnMovementVoided).toBe(false);
        expect(notification.notifyOnPaymentCreated).toBe(true);
      });
    });
  });

  describe('toJson', () => {
    it('should return a plain object representation for staff defaults', () => {
      const notification = UserNotification.forRole(UserRole.STAFF);

      expect(notification.toJson()).toEqual({
        notifyOnDueCreated: false,
        notifyOnMemberCreated: false,
        notifyOnMovementCreated: false,
        notifyOnMovementVoided: false,
        notifyOnPaymentCreated: false,
      });
    });

    it('should return a plain object representation for member defaults', () => {
      const notification = UserNotification.forRole(UserRole.MEMBER);

      expect(notification.toJson()).toEqual({
        notifyOnDueCreated: true,
        notifyOnMemberCreated: false,
        notifyOnMovementCreated: false,
        notifyOnMovementVoided: false,
        notifyOnPaymentCreated: true,
      });
    });

    it('should return a plain object representation with custom values', () => {
      const notification = UserNotification.forRole(UserRole.STAFF, {
        notifyOnDueCreated: true,
        notifyOnMemberCreated: true,
        notifyOnMovementCreated: true,
        notifyOnMovementVoided: true,
        notifyOnPaymentCreated: true,
      });

      expect(notification.toJson()).toEqual({
        notifyOnDueCreated: true,
        notifyOnMemberCreated: true,
        notifyOnMovementCreated: true,
        notifyOnMovementVoided: true,
        notifyOnPaymentCreated: true,
      });
    });
  });

  describe('toJsonForRole', () => {
    it('should return only member-relevant fields for MEMBER role', () => {
      const notification = UserNotification.forRole(UserRole.MEMBER);

      expect(notification.toJsonForRole(UserRole.MEMBER)).toEqual({
        notifyOnDueCreated: true,
        notifyOnPaymentCreated: true,
      });
    });

    it('should return all fields for STAFF role', () => {
      const notification = UserNotification.forRole(UserRole.STAFF, {
        notifyOnDueCreated: true,
        notifyOnMemberCreated: true,
      });

      expect(notification.toJsonForRole(UserRole.STAFF)).toEqual({
        notifyOnDueCreated: true,
        notifyOnMemberCreated: true,
        notifyOnMovementCreated: false,
        notifyOnMovementVoided: false,
        notifyOnPaymentCreated: false,
      });
    });

    it('should return empty object for ADMIN role', () => {
      const notification = UserNotification.forRole(UserRole.ADMIN);

      expect(notification.toJsonForRole(UserRole.ADMIN)).toEqual({});
    });
  });

  describe('update', () => {
    it('should update defined values and keep existing ones', () => {
      const notification = UserNotification.forRole(UserRole.STAFF, {
        notifyOnDueCreated: true,
        notifyOnMemberCreated: false,
      });

      const updated = notification.update({
        notifyOnMemberCreated: true,
      });

      expect(updated.notifyOnDueCreated).toBe(true);
      expect(updated.notifyOnMemberCreated).toBe(true);
      expect(updated.notifyOnMovementCreated).toBe(false);
      expect(updated.notifyOnMovementVoided).toBe(false);
      expect(updated.notifyOnPaymentCreated).toBe(false);
    });

    it('should ignore undefined values in updates', () => {
      const notification = UserNotification.forRole(UserRole.MEMBER);

      const updated = notification.update({
        notifyOnDueCreated: undefined,
        notifyOnPaymentCreated: undefined,
      });

      expect(updated.notifyOnDueCreated).toBe(true);
      expect(updated.notifyOnPaymentCreated).toBe(true);
    });

    it('should allow setting values to false explicitly', () => {
      const notification = UserNotification.forRole(UserRole.MEMBER);

      const updated = notification.update({
        notifyOnDueCreated: false,
        notifyOnPaymentCreated: false,
      });

      expect(updated.notifyOnDueCreated).toBe(false);
      expect(updated.notifyOnPaymentCreated).toBe(false);
    });

    it('should return a new instance without mutating the original', () => {
      const original = UserNotification.forRole(UserRole.STAFF);
      const updated = original.update({ notifyOnMemberCreated: true });

      expect(original.notifyOnMemberCreated).toBe(false);
      expect(updated.notifyOnMemberCreated).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return a JSON string representation', () => {
      const notification = UserNotification.forRole(UserRole.STAFF, {
        notifyOnDueCreated: true,
      });

      expect(notification.toString()).toBe(
        JSON.stringify(notification.toJson()),
      );
    });
  });
});
