import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';

import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_CREATED_BY,
  TEST_NOTIFICATION_ERROR,
  TEST_NOTIFICATION_PAYLOAD,
  TEST_NOTIFICATION_PROVIDER_MESSAGE_ID,
  TEST_NOTIFICATION_RECIPIENT,
  TEST_NOTIFICATION_SOURCE_ENTITY,
} from '@/shared/test/constants';
import {
  createNotificationProps,
  createTestNotification,
  createTestNotificationFromPersistence,
} from '@/shared/test/factories/notification.factory';

import { NotificationEntity } from './notification.entity';

describe('NotificationEntity', () => {
  describe('create', () => {
    it('should create a notification with valid props', () => {
      const props = createNotificationProps();

      const result = NotificationEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const notification = result._unsafeUnwrap();
      expect(notification.channel).toBe(NotificationChannel.EMAIL);
      expect(notification.type).toBe(NotificationType.DUE_CREATED);
      expect(notification.recipientAddress).toBe(TEST_NOTIFICATION_RECIPIENT);
      expect(notification.payload).toEqual(TEST_NOTIFICATION_PAYLOAD);
      expect(notification.sourceEntity).toBe(TEST_NOTIFICATION_SOURCE_ENTITY);
      expect(notification.userId).toBe(props.userId);
      expect(notification.status).toBe(NotificationStatus.PENDING);
      expect(notification.attempts).toBe(0);
      expect(notification.maxAttempts).toBe(3);
      expect(notification.queuedAt).toBeNull();
      expect(notification.processedAt).toBeNull();
      expect(notification.scheduledAt).toBeNull();
      expect(notification.sentAt).toBeNull();
      expect(notification.deliveredAt).toBeNull();
      expect(notification.providerMessageId).toBeNull();
      expect(notification.lastError).toBeNull();
      expect(notification.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a notification without source entity', () => {
      const props = createNotificationProps({
        sourceEntity: null,
        sourceEntityId: null,
      });

      const result = NotificationEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const notification = result._unsafeUnwrap();
      expect(notification.sourceEntity).toBeNull();
      expect(notification.sourceEntityId).toBeNull();
    });
  });

  describe('fromPersistence', () => {
    it('should create a notification from persisted data', () => {
      const id = UniqueId.generate();
      const userId = UniqueId.generate();

      const notification = createTestNotificationFromPersistence(
        {
          channel: NotificationChannel.EMAIL,
          type: NotificationType.PAYMENT_MADE,
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

      expect(notification.id).toBe(id);
      expect(notification.userId).toBe(userId);
      expect(notification.type).toBe(NotificationType.PAYMENT_MADE);
      expect(notification.status).toBe(NotificationStatus.PENDING);
      expect(notification.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a sent notification from persisted data', () => {
      const sentAt = new Date('2024-01-15');

      const notification = createTestNotificationFromPersistence({
        attempts: 1,
        processedAt: new Date('2024-01-15'),
        providerMessageId: TEST_NOTIFICATION_PROVIDER_MESSAGE_ID,
        sentAt,
        status: NotificationStatus.SENT,
      });

      expect(notification.status).toBe(NotificationStatus.SENT);
      expect(notification.sentAt).toBe(sentAt);
      expect(notification.providerMessageId).toBe(
        TEST_NOTIFICATION_PROVIDER_MESSAGE_ID,
      );
      expect(notification.attempts).toBe(1);
    });

    it('should create a failed notification from persisted data', () => {
      const notification = createTestNotificationFromPersistence({
        attempts: 3,
        lastError: TEST_NOTIFICATION_ERROR,
        status: NotificationStatus.FAILED,
      });

      expect(notification.status).toBe(NotificationStatus.FAILED);
      expect(notification.lastError).toBe(TEST_NOTIFICATION_ERROR);
      expect(notification.attempts).toBe(3);
    });
  });

  describe('status transitions', () => {
    describe('markAsQueued', () => {
      it('should mark notification as queued', () => {
        const notification = createTestNotification();

        notification.markAsQueued(TEST_CREATED_BY);

        expect(notification.status).toBe(NotificationStatus.QUEUED);
        expect(notification.queuedAt).toBeInstanceOf(Date);
        expect(notification.updatedBy).toBe(TEST_CREATED_BY);
      });
    });

    describe('markAsProcessing', () => {
      it('should mark notification as processing and increment attempts', () => {
        const notification = createTestNotification();
        expect(notification.attempts).toBe(0);

        notification.markAsProcessing(TEST_CREATED_BY);

        expect(notification.status).toBe(NotificationStatus.PROCESSING);
        expect(notification.processedAt).toBeInstanceOf(Date);
        expect(notification.attempts).toBe(1);
        expect(notification.updatedBy).toBe(TEST_CREATED_BY);
      });

      it('should increment attempts on each processing', () => {
        const notification = createTestNotificationFromPersistence({
          attempts: 1,
          status: NotificationStatus.QUEUED,
        });

        notification.markAsProcessing(TEST_CREATED_BY);

        expect(notification.attempts).toBe(2);
      });
    });

    describe('markAsSent', () => {
      it('should mark notification as sent with provider message id', () => {
        const notification = createTestNotification();
        notification.markAsProcessing(TEST_CREATED_BY);

        notification.markAsSent(
          TEST_NOTIFICATION_PROVIDER_MESSAGE_ID,
          TEST_CREATED_BY,
        );

        expect(notification.status).toBe(NotificationStatus.SENT);
        expect(notification.sentAt).toBeInstanceOf(Date);
        expect(notification.providerMessageId).toBe(
          TEST_NOTIFICATION_PROVIDER_MESSAGE_ID,
        );
        expect(notification.updatedBy).toBe(TEST_CREATED_BY);
      });
    });

    describe('markAsDelivered', () => {
      it('should mark notification as delivered', () => {
        const notification = createTestNotificationFromPersistence({
          providerMessageId: TEST_NOTIFICATION_PROVIDER_MESSAGE_ID,
          sentAt: new Date(),
          status: NotificationStatus.SENT,
        });

        notification.markAsDelivered(TEST_CREATED_BY);

        expect(notification.status).toBe(NotificationStatus.DELIVERED);
        expect(notification.deliveredAt).toBeInstanceOf(Date);
        expect(notification.updatedBy).toBe(TEST_CREATED_BY);
      });
    });

    describe('markAsFailed', () => {
      it('should mark notification as failed', () => {
        const notification = createTestNotificationFromPersistence({
          attempts: 3,
          lastError: TEST_NOTIFICATION_ERROR,
          status: NotificationStatus.PROCESSING,
        });

        notification.markAsFailed('Email failed', TEST_CREATED_BY);

        expect(notification.status).toBe(NotificationStatus.FAILED);
        expect(notification.updatedBy).toBe(TEST_CREATED_BY);
      });
    });

    describe('markAsBounced', () => {
      it('should mark notification as bounced with error', () => {
        const notification = createTestNotificationFromPersistence({
          providerMessageId: TEST_NOTIFICATION_PROVIDER_MESSAGE_ID,
          sentAt: new Date(),
          status: NotificationStatus.SENT,
        });

        notification.markAsBounced(
          'Hard bounce: invalid email',
          TEST_CREATED_BY,
        );

        expect(notification.status).toBe(NotificationStatus.BOUNCED);
        expect(notification.lastError).toBe('Hard bounce: invalid email');
        expect(notification.updatedBy).toBe(TEST_CREATED_BY);
      });
    });

    describe('markAsSuppressed', () => {
      it('should mark notification as suppressed with reason', () => {
        const notification = createTestNotification();

        notification.markAsSuppressed(
          'Email in suppression list',
          TEST_CREATED_BY,
        );

        expect(notification.status).toBe(NotificationStatus.SUPPRESSED);
        expect(notification.lastError).toBe('Email in suppression list');
        expect(notification.updatedBy).toBe(TEST_CREATED_BY);
      });
    });
  });

  describe('fail', () => {
    it('should set last error without changing status', () => {
      const notification = createTestNotificationFromPersistence({
        status: NotificationStatus.PROCESSING,
      });

      notification.fail(TEST_NOTIFICATION_ERROR, TEST_CREATED_BY);

      expect(notification.status).toBe(NotificationStatus.PROCESSING);
      expect(notification.lastError).toBe(TEST_NOTIFICATION_ERROR);
      expect(notification.updatedBy).toBe(TEST_CREATED_BY);
    });
  });

  describe('canRetry', () => {
    it('should return true when attempts are less than max attempts', () => {
      const notification = createTestNotificationFromPersistence({
        attempts: 1,
        maxAttempts: 3,
      });

      expect(notification.canRetry()).toBe(true);
    });

    it('should return true when attempts equal max attempts minus one', () => {
      const notification = createTestNotificationFromPersistence({
        attempts: 2,
        maxAttempts: 3,
      });

      expect(notification.canRetry()).toBe(true);
    });

    it('should return false when attempts equal max attempts', () => {
      const notification = createTestNotificationFromPersistence({
        attempts: 3,
        maxAttempts: 3,
      });

      expect(notification.canRetry()).toBe(false);
    });

    it('should return false when attempts exceed max attempts', () => {
      const notification = createTestNotificationFromPersistence({
        attempts: 4,
        maxAttempts: 3,
      });

      expect(notification.canRetry()).toBe(false);
    });
  });

  describe('status checks', () => {
    it('should reflect status helpers for each status', () => {
      const cases = [
        {
          expected: {
            isBounced: false,
            isDelivered: false,
            isFailed: false,
            isPending: true,
            isProcessing: false,
            isQueued: false,
            isSent: false,
            isSuppressed: false,
          },
          status: NotificationStatus.PENDING,
        },
        {
          expected: {
            isBounced: false,
            isDelivered: false,
            isFailed: false,
            isPending: false,
            isProcessing: false,
            isQueued: true,
            isSent: false,
            isSuppressed: false,
          },
          status: NotificationStatus.QUEUED,
        },
        {
          expected: {
            isBounced: false,
            isDelivered: false,
            isFailed: false,
            isPending: false,
            isProcessing: true,
            isQueued: false,
            isSent: false,
            isSuppressed: false,
          },
          status: NotificationStatus.PROCESSING,
        },
        {
          expected: {
            isBounced: false,
            isDelivered: false,
            isFailed: false,
            isPending: false,
            isProcessing: false,
            isQueued: false,
            isSent: true,
            isSuppressed: false,
          },
          status: NotificationStatus.SENT,
        },
        {
          expected: {
            isBounced: false,
            isDelivered: true,
            isFailed: false,
            isPending: false,
            isProcessing: false,
            isQueued: false,
            isSent: false,
            isSuppressed: false,
          },
          status: NotificationStatus.DELIVERED,
        },
        {
          expected: {
            isBounced: true,
            isDelivered: false,
            isFailed: false,
            isPending: false,
            isProcessing: false,
            isQueued: false,
            isSent: false,
            isSuppressed: false,
          },
          status: NotificationStatus.BOUNCED,
        },
        {
          expected: {
            isBounced: false,
            isDelivered: false,
            isFailed: true,
            isPending: false,
            isProcessing: false,
            isQueued: false,
            isSent: false,
            isSuppressed: false,
          },
          status: NotificationStatus.FAILED,
        },
        {
          expected: {
            isBounced: false,
            isDelivered: false,
            isFailed: false,
            isPending: false,
            isProcessing: false,
            isQueued: false,
            isSent: false,
            isSuppressed: true,
          },
          status: NotificationStatus.SUPPRESSED,
        },
      ];

      cases.forEach(({ expected, status }) => {
        const notification = createTestNotificationFromPersistence({ status });

        expect(notification.isPending()).toBe(expected.isPending);
        expect(notification.isQueued()).toBe(expected.isQueued);
        expect(notification.isProcessing()).toBe(expected.isProcessing);
        expect(notification.isSent()).toBe(expected.isSent);
        expect(notification.isDelivered()).toBe(expected.isDelivered);
        expect(notification.isBounced()).toBe(expected.isBounced);
        expect(notification.isFailed()).toBe(expected.isFailed);
        expect(notification.isSuppressed()).toBe(expected.isSuppressed);
      });
    });
  });
});
