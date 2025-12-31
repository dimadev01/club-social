import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementCreatedEvent } from '../events/movement-created.event';
import { MovementUpdatedEvent } from '../events/movement-updated.event';
import { MovementEntity } from './movement.entity';

describe('MovementEntity', () => {
  const createValidInflowProps = () => ({
    amount: SignedAmount.fromCents(10000)._unsafeUnwrap(),
    category: MovementCategory.MEMBER_LEDGER,
    date: DateOnly.fromString('2024-01-15')._unsafeUnwrap(),
    mode: MovementMode.MANUAL,
    notes: 'Manual inflow',
    paymentId: null,
    status: MovementStatus.REGISTERED,
  });

  const createValidOutflowProps = () => ({
    amount: SignedAmount.fromCents(-5000)._unsafeUnwrap(),
    category: MovementCategory.EXPENSE,
    date: DateOnly.fromString('2024-01-15')._unsafeUnwrap(),
    mode: MovementMode.MANUAL,
    notes: 'Manual outflow',
    paymentId: null,
    status: MovementStatus.REGISTERED,
  });

  describe('create', () => {
    it('should create a movement with valid props', () => {
      const props = createValidInflowProps();
      const createdBy = 'user-123';

      const result = MovementEntity.create(props, createdBy);

      expect(result.isOk()).toBe(true);
      const movement = result._unsafeUnwrap();
      expect(movement.amount.cents).toBe(10000);
      expect(movement.category).toBe(MovementCategory.MEMBER_LEDGER);
      expect(movement.date.value).toBe('2024-01-15');
      expect(movement.mode).toBe(MovementMode.MANUAL);
      expect(movement.notes).toBe('Manual inflow');
      expect(movement.paymentId).toBeNull();
      expect(movement.status).toBe(MovementStatus.REGISTERED);
      expect(movement.voidedAt).toBeNull();
      expect(movement.voidedBy).toBeNull();
      expect(movement.voidReason).toBeNull();
      expect(movement.createdBy).toBe(createdBy);
    });

    it('should create an outflow movement', () => {
      const props = createValidOutflowProps();

      const result = MovementEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      const movement = result._unsafeUnwrap();
      expect(movement.amount.cents).toBe(-5000);
      expect(movement.isOutflow()).toBe(true);
    });

    it('should create an automatic movement', () => {
      const props = {
        ...createValidInflowProps(),
        mode: MovementMode.AUTOMATIC,
        paymentId: UniqueId.generate(),
      };

      const result = MovementEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().mode).toBe(MovementMode.AUTOMATIC);
    });

    it('should add MovementCreatedEvent on creation', () => {
      const props = createValidInflowProps();

      const result = MovementEntity.create(props, 'user-123');
      const movement = result._unsafeUnwrap();
      const events = movement.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MovementCreatedEvent);
      expect((events[0] as MovementCreatedEvent).movement).toBe(movement);
    });
  });

  describe('fromPersistence', () => {
    it('should create a movement from persisted data', () => {
      const id = UniqueId.generate();
      const paymentId = UniqueId.generate();

      const movement = MovementEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(7500)._unsafeUnwrap(),
          category: MovementCategory.BUFFET,
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          mode: MovementMode.AUTOMATIC,
          notes: 'Buffet sale',
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
      expect(movement.amount.cents).toBe(7500);
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
          voidedBy: 'admin',
          voidReason: 'Error in entry',
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      expect(movement.status).toBe(MovementStatus.VOIDED);
      expect(movement.voidedAt).toBe(voidedAt);
      expect(movement.voidedBy).toBe('admin');
      expect(movement.voidReason).toBe('Error in entry');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the movement', () => {
      const props = createValidInflowProps();
      const original = MovementEntity.create(props, 'user-123')._unsafeUnwrap();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.category).toBe(original.category);
      expect(cloned.date.value).toBe(original.date.value);
      expect(cloned.mode).toBe(original.mode);
      expect(cloned.status).toBe(original.status);
    });

    it('should create an independent copy', () => {
      const props = createValidInflowProps();
      const original = MovementEntity.create(props, 'user-123')._unsafeUnwrap();
      const cloned = original.clone();

      original.void({ voidedBy: 'admin', voidReason: 'Test void' });

      expect(original.isVoided()).toBe(true);
      expect(cloned.isVoided()).toBe(false);
    });
  });

  describe('isInflow', () => {
    it('should return true for positive amounts', () => {
      const movement = MovementEntity.create(
        createValidInflowProps(),
        'user-123',
      )._unsafeUnwrap();

      expect(movement.isInflow()).toBe(true);
      expect(movement.isOutflow()).toBe(false);
    });
  });

  describe('isOutflow', () => {
    it('should return true for negative amounts', () => {
      const movement = MovementEntity.create(
        createValidOutflowProps(),
        'user-123',
      )._unsafeUnwrap();

      expect(movement.isOutflow()).toBe(true);
      expect(movement.isInflow()).toBe(false);
    });
  });

  describe('isRegistered', () => {
    it('should return true when status is REGISTERED', () => {
      const movement = MovementEntity.create(
        createValidInflowProps(),
        'user-123',
      )._unsafeUnwrap();

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
          voidedBy: 'admin',
          voidReason: 'Test',
        },
        {
          audit: { createdBy: 'user' },
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
          voidedBy: 'admin',
          voidReason: 'Test',
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      expect(movement.isVoided()).toBe(true);
    });

    it('should return false when status is REGISTERED', () => {
      const movement = MovementEntity.create(
        createValidInflowProps(),
        'user-123',
      )._unsafeUnwrap();

      expect(movement.isVoided()).toBe(false);
    });
  });

  describe('void', () => {
    it('should void a manual registered movement', () => {
      const movement = MovementEntity.create(
        createValidInflowProps(),
        'user-123',
      )._unsafeUnwrap();
      movement.pullEvents(); // Clear creation event

      const result = movement.void({
        voidedBy: 'admin',
        voidReason: 'Entry error',
      });

      expect(result.isOk()).toBe(true);
      expect(movement.status).toBe(MovementStatus.VOIDED);
      expect(movement.voidedBy).toBe('admin');
      expect(movement.voidReason).toBe('Entry error');
      expect(movement.voidedAt).toBeInstanceOf(Date);
      expect(movement.updatedBy).toBe('admin');
    });

    it('should add MovementUpdatedEvent when voiding', () => {
      const movement = MovementEntity.create(
        createValidInflowProps(),
        'user-123',
      )._unsafeUnwrap();
      movement.pullEvents();

      movement.void({ voidedBy: 'admin', voidReason: 'Test' });

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
          voidedBy: 'admin',
          voidReason: 'Already voided',
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      const result = movement.void({
        voidedBy: 'admin',
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
        voidedBy: 'admin',
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
        { audit: { createdBy: 'user' }, id },
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
          voidedBy: 'admin',
          voidReason: 'Voided',
        },
        { audit: { createdBy: 'admin' }, id },
      );

      expect(movement1.equals(movement2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const baseProps = {
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
      };

      const movement1 = MovementEntity.fromPersistence(baseProps, {
        audit: { createdBy: 'user' },
        id: UniqueId.generate(),
      });

      const movement2 = MovementEntity.fromPersistence(baseProps, {
        audit: { createdBy: 'user' },
        id: UniqueId.generate(),
      });

      expect(movement1.equals(movement2)).toBe(false);
    });
  });

  describe('different categories', () => {
    const categories = Object.values(MovementCategory);

    it.each(categories)('should create movement with category %s', (category) => {
      const props = {
        ...createValidInflowProps(),
        category,
      };

      const result = MovementEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().category).toBe(category);
    });
  });
});
