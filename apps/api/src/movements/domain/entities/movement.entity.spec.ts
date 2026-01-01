import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ALT_MOVEMENT_AMOUNT_CENTS,
  TEST_ALT_MOVEMENT_NOTES,
  TEST_CREATED_BY,
  TEST_MOVEMENT_DATE,
  TEST_MOVEMENT_INFLOW_AMOUNT_CENTS,
  TEST_MOVEMENT_INFLOW_NOTES,
  TEST_MOVEMENT_OUTFLOW_AMOUNT_CENTS,
} from '@/shared/test/constants';
import {
  createInflowMovementProps,
  createTestInflowMovement,
  createTestOutflowMovement,
} from '@/shared/test/factories';

import { MovementCreatedEvent } from '../events/movement-created.event';
import { MovementUpdatedEvent } from '../events/movement-updated.event';
import { MovementEntity } from './movement.entity';

describe('MovementEntity', () => {
  describe('create', () => {
    it('should create a movement with valid props', () => {
      const props = createInflowMovementProps();

      const result = MovementEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const movement = result._unsafeUnwrap();
      expect(movement.amount.cents).toBe(TEST_MOVEMENT_INFLOW_AMOUNT_CENTS);
      expect(movement.category).toBe(MovementCategory.MEMBER_LEDGER);
      expect(movement.date.value).toBe(TEST_MOVEMENT_DATE);
      expect(movement.mode).toBe(MovementMode.MANUAL);
      expect(movement.notes).toBe(TEST_MOVEMENT_INFLOW_NOTES);
      expect(movement.paymentId).toBeNull();
      expect(movement.status).toBe(MovementStatus.REGISTERED);
      expect(movement.voidedAt).toBeNull();
      expect(movement.voidedBy).toBeNull();
      expect(movement.voidReason).toBeNull();
      expect(movement.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create an outflow movement using overrides', () => {
      const movement = createTestOutflowMovement();

      expect(movement.amount.cents).toBe(TEST_MOVEMENT_OUTFLOW_AMOUNT_CENTS);
      expect(movement.isOutflow()).toBe(true);
    });

    it('should create an automatic movement using overrides', () => {
      const paymentId = UniqueId.generate();

      const movement = createTestInflowMovement({
        mode: MovementMode.AUTOMATIC,
        paymentId,
      });

      expect(movement.mode).toBe(MovementMode.AUTOMATIC);
      expect(movement.paymentId).toBe(paymentId);
    });

    it('should create a movement with different category using overrides', () => {
      const movement = createTestInflowMovement({
        category: MovementCategory.BUFFET,
      });

      expect(movement.category).toBe(MovementCategory.BUFFET);
    });

    it('should add MovementCreatedEvent on creation', () => {
      const movement = createTestInflowMovement();
      const events = movement.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MovementCreatedEvent);
      expect((events[0] as MovementCreatedEvent).movement).toBe(movement);
    });

    it('should generate unique ids for each movement', () => {
      const movement1 = createTestInflowMovement();
      const movement2 = createTestInflowMovement();

      expect(movement1.id.value).not.toBe(movement2.id.value);
    });
  });

  describe('fromPersistence', () => {
    it('should create a movement from persisted data', () => {
      const id = UniqueId.generate();
      const paymentId = UniqueId.generate();

      const movement = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(
            TEST_ALT_MOVEMENT_AMOUNT_CENTS,
          )._unsafeUnwrap(),
          category: MovementCategory.BUFFET,
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          mode: MovementMode.AUTOMATIC,
          notes: TEST_ALT_MOVEMENT_NOTES,
          paymentId,
          status: MovementStatus.REGISTERED,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        {
          audit: { createdBy: 'system' },
          id,
        },
      );

      expect(movement.id).toBe(id);
      expect(movement.amount.cents).toBe(TEST_ALT_MOVEMENT_AMOUNT_CENTS);
      expect(movement.paymentId).toBe(paymentId);
    });

    it('should create a voided movement from persisted data', () => {
      const voidedAt = new Date('2024-03-01');

      const movement = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(5000)._unsafeUnwrap(),
          category: MovementCategory.EXPENSE,
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          mode: MovementMode.MANUAL,
          notes: null,
          paymentId: null,
          status: MovementStatus.VOIDED,
          voidedAt,
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Error in entry',
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      expect(movement.status).toBe(MovementStatus.VOIDED);
      expect(movement.voidedAt).toBe(voidedAt);
      expect(movement.voidedBy).toBe(TEST_CREATED_BY);
      expect(movement.voidReason).toBe('Error in entry');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the movement', () => {
      const original = createTestInflowMovement();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.category).toBe(original.category);
      expect(cloned.date.value).toBe(original.date.value);
      expect(cloned.mode).toBe(original.mode);
      expect(cloned.status).toBe(original.status);
    });

    it('should create an independent copy', () => {
      const original = createTestInflowMovement();
      original.pullEvents();
      const cloned = original.clone();

      original.void({ voidedBy: TEST_CREATED_BY, voidReason: 'Test void' });

      expect(original.isVoided()).toBe(true);
      expect(cloned.isVoided()).toBe(false);
    });
  });

  describe('isInflow', () => {
    it('should return true for positive amounts', () => {
      const movement = createTestInflowMovement();

      expect(movement.isInflow()).toBe(true);
      expect(movement.isOutflow()).toBe(false);
    });
  });

  describe('isOutflow', () => {
    it('should return true for negative amounts', () => {
      const movement = createTestOutflowMovement();

      expect(movement.isOutflow()).toBe(true);
      expect(movement.isInflow()).toBe(false);
    });
  });

  describe('isRegistered', () => {
    it('should return true when status is REGISTERED', () => {
      const movement = createTestInflowMovement();

      expect(movement.isRegistered()).toBe(true);
    });

    it('should return false when status is VOIDED', () => {
      const movement = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(1000)._unsafeUnwrap(),
          category: MovementCategory.OTHER,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          mode: MovementMode.MANUAL,
          notes: null,
          paymentId: null,
          status: MovementStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Test',
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      expect(movement.isRegistered()).toBe(false);
    });
  });

  describe('isVoided', () => {
    it('should return true when status is VOIDED', () => {
      const movement = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(1000)._unsafeUnwrap(),
          category: MovementCategory.OTHER,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          mode: MovementMode.MANUAL,
          notes: null,
          paymentId: null,
          status: MovementStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Test',
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      expect(movement.isVoided()).toBe(true);
    });

    it('should return false when status is REGISTERED', () => {
      const movement = createTestInflowMovement();

      expect(movement.isVoided()).toBe(false);
    });
  });

  describe('void', () => {
    it('should void a manual registered movement', () => {
      const movement = createTestInflowMovement();
      movement.pullEvents();

      const result = movement.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Entry error',
      });

      expect(result.isOk()).toBe(true);
      expect(movement.status).toBe(MovementStatus.VOIDED);
      expect(movement.voidedBy).toBe(TEST_CREATED_BY);
      expect(movement.voidReason).toBe('Entry error');
      expect(movement.voidedAt).toBeInstanceOf(Date);
      expect(movement.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should add MovementUpdatedEvent when voiding', () => {
      const movement = createTestInflowMovement();
      movement.pullEvents();

      movement.void({ voidedBy: TEST_CREATED_BY, voidReason: 'Test' });

      const events = movement.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MovementUpdatedEvent);

      const event = events[0] as MovementUpdatedEvent;
      expect(event.oldMovement.status).toBe(MovementStatus.REGISTERED);
      expect(event.movement.status).toBe(MovementStatus.VOIDED);
    });

    it('should fail to void an already voided movement', () => {
      const movement = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(1000)._unsafeUnwrap(),
          category: MovementCategory.OTHER,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          mode: MovementMode.MANUAL,
          notes: null,
          paymentId: null,
          status: MovementStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Already voided',
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      const result = movement.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Try again',
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede anular un movimiento anulado',
      );
    });

    it('should fail to void an automatic movement', () => {
      const movement = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(1000)._unsafeUnwrap(),
          category: MovementCategory.MEMBER_LEDGER,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          mode: MovementMode.AUTOMATIC,
          notes: null,
          paymentId: UniqueId.generate(),
          status: MovementStatus.REGISTERED,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        {
          audit: { createdBy: 'system' },
          id: UniqueId.generate(),
        },
      );

      const result = movement.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Try to void automatic',
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede anular un movimiento automático',
      );
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();

      const movement1 = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(1000)._unsafeUnwrap(),
          category: MovementCategory.OTHER,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          mode: MovementMode.MANUAL,
          notes: null,
          paymentId: null,
          status: MovementStatus.REGISTERED,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id },
      );

      const movement2 = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(2000)._unsafeUnwrap(),
          category: MovementCategory.BUFFET,
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          mode: MovementMode.AUTOMATIC,
          notes: 'Different',
          paymentId: null,
          status: MovementStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Voided',
        },
        { audit: { createdBy: TEST_CREATED_BY }, id },
      );

      expect(movement1.equals(movement2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const movement1 = createTestInflowMovement();
      const movement2 = createTestInflowMovement();

      expect(movement1.equals(movement2)).toBe(false);
    });
  });

  describe('different categories', () => {
    const categories = Object.values(MovementCategory);

    it.each(categories)(
      'should create movement with category %s',
      (category) => {
        const movement = createTestInflowMovement({ category });

        expect(movement.category).toBe(category);
      },
    );
  });
});
