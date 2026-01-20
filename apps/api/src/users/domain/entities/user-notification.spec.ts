import {
  DEFAULT_MEMBER_USER_NOTIFICATION,
  DEFAULT_USER_NOTIFICATION,
  UserNotification,
} from './user-notification';

describe('UserNotification', () => {
  describe('forUser', () => {
    it('should create notification preferences with user defaults when no props are provided', () => {
      const notification = UserNotification.forUser();

      expect(notification.notifyOnDueCreated).toBe(false);
      expect(notification.notifyOnMemberCreated).toBe(false);
      expect(notification.notifyOnMovementCreated).toBe(false);
      expect(notification.notifyOnMovementVoided).toBe(false);
      expect(notification.notifyOnPaymentCreated).toBe(false);
    });

    it('should create notification preferences using overrides', () => {
      const notification = UserNotification.forUser({
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

  describe('forMember', () => {
    it('should create notification preferences with member defaults when no props are provided', () => {
      const notification = UserNotification.forMember();

      expect(notification.notifyOnDueCreated).toBe(true);
      expect(notification.notifyOnMemberCreated).toBe(false);
      expect(notification.notifyOnMovementCreated).toBe(false);
      expect(notification.notifyOnMovementVoided).toBe(false);
      expect(notification.notifyOnPaymentCreated).toBe(true);
    });

    it('should create notification preferences using overrides', () => {
      const notification = UserNotification.forMember({
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

  describe('toJson', () => {
    it('should return a plain object representation for user defaults', () => {
      const notification = UserNotification.forUser();

      expect(notification.toJson()).toEqual(DEFAULT_USER_NOTIFICATION);
    });

    it('should return a plain object representation for member defaults', () => {
      const notification = UserNotification.forMember();

      expect(notification.toJson()).toEqual(DEFAULT_MEMBER_USER_NOTIFICATION);
    });

    it('should return a plain object representation with custom values', () => {
      const notification = UserNotification.forUser({
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

  describe('update', () => {
    it('should update defined values and keep existing ones', () => {
      const notification = UserNotification.forUser({
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
      const notification = UserNotification.forMember();

      const updated = notification.update({
        notifyOnDueCreated: undefined,
        notifyOnPaymentCreated: undefined,
      });

      expect(updated.notifyOnDueCreated).toBe(true);
      expect(updated.notifyOnPaymentCreated).toBe(true);
    });

    it('should allow setting values to false explicitly', () => {
      const notification = UserNotification.forMember();

      const updated = notification.update({
        notifyOnDueCreated: false,
        notifyOnPaymentCreated: false,
      });

      expect(updated.notifyOnDueCreated).toBe(false);
      expect(updated.notifyOnPaymentCreated).toBe(false);
    });

    it('should return a new instance without mutating the original', () => {
      const original = UserNotification.forUser();
      const updated = original.update({ notifyOnMemberCreated: true });

      expect(original.notifyOnMemberCreated).toBe(false);
      expect(updated.notifyOnMemberCreated).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return a JSON string representation', () => {
      const notification = UserNotification.forUser({
        notifyOnDueCreated: true,
      });

      expect(notification.toString()).toBe(
        JSON.stringify(notification.toJson()),
      );
    });
  });
});
