import { MemberNotification } from './member-notification';

describe(MemberNotification.name, () => {
  describe('raw', () => {
    it('should create notification preferences with defaults when no props are provided', () => {
      const preferences = new MemberNotification();

      expect(preferences.notifyOnDueCreated).toBe(true);
      expect(preferences.notifyOnPaymentMade).toBe(true);
    });

    it('should create notification preferences using overrides', () => {
      const preferences = new MemberNotification({
        notifyOnDueCreated: false,
        notifyOnPaymentMade: true,
      });

      expect(preferences.notifyOnDueCreated).toBe(false);
      expect(preferences.notifyOnPaymentMade).toBe(true);
    });

    it('should create notification preferences with partial overrides', () => {
      const preferences = new MemberNotification({
        notifyOnDueCreated: false,
      });

      expect(preferences.notifyOnDueCreated).toBe(false);
      expect(preferences.notifyOnPaymentMade).toBe(true);
    });
  });

  describe('toJson', () => {
    it('should return a plain object representation', () => {
      const preferences = new MemberNotification({
        notifyOnDueCreated: true,
        notifyOnPaymentMade: false,
      });

      expect(preferences.toJson()).toEqual({
        notifyOnDueCreated: true,
        notifyOnPaymentMade: false,
      });
    });

    it('should return a plain object with default values', () => {
      const preferences = new MemberNotification();

      expect(preferences.toJson()).toEqual({
        notifyOnDueCreated: true,
        notifyOnPaymentMade: true,
      });
    });
  });

  describe('update', () => {
    it('should update defined values and keep existing ones', () => {
      const preferences = new MemberNotification({
        notifyOnDueCreated: true,
        notifyOnPaymentMade: true,
      });

      const updated = preferences.update({
        notifyOnPaymentMade: false,
      });

      expect(updated.notifyOnDueCreated).toBe(true);
      expect(updated.notifyOnPaymentMade).toBe(false);
    });

    it('should ignore undefined values in updates', () => {
      const preferences = new MemberNotification({
        notifyOnDueCreated: false,
        notifyOnPaymentMade: false,
      });

      const updated = preferences.update({
        notifyOnDueCreated: undefined,
      });

      expect(updated.notifyOnDueCreated).toBe(false);
      expect(updated.notifyOnPaymentMade).toBe(false);
    });

    it('should update all preferences at once', () => {
      const preferences = new MemberNotification({
        notifyOnDueCreated: true,
        notifyOnPaymentMade: true,
      });

      const updated = preferences.update({
        notifyOnDueCreated: false,
        notifyOnPaymentMade: false,
      });

      expect(updated.notifyOnDueCreated).toBe(false);
      expect(updated.notifyOnPaymentMade).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return a string representation of the preferences', () => {
      const preferences = new MemberNotification({
        notifyOnDueCreated: true,
        notifyOnPaymentMade: false,
      });

      expect(preferences.toString()).toBe(JSON.stringify(preferences.toJson()));
    });

    it('should return a string representation of default preferences', () => {
      const preferences = new MemberNotification();

      expect(preferences.toString()).toBe(
        JSON.stringify({
          notifyOnDueCreated: true,
          notifyOnPaymentMade: true,
        }),
      );
    });
  });
});
