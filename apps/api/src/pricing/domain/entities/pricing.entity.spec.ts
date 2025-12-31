import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingCreatedEvent } from '../events/pricing-created.event';
import { PricingUpdatedEvent } from '../events/pricing-updated.event';
import { PricingEntity } from './pricing.entity';

describe('PricingEntity', () => {
  const createValidPricingProps = () => ({
    amount: Amount.fromCents(50000)._unsafeUnwrap(),
    dueCategory: DueCategory.MEMBERSHIP,
    effectiveFrom: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
    memberCategory: MemberCategory.MEMBER,
  });

  describe('create', () => {
    it('should create a pricing with valid props', () => {
      const props = createValidPricingProps();
      const createdBy = 'admin-123';

      const result = PricingEntity.create(props, createdBy);

      expect(result.isOk()).toBe(true);
      const pricing = result._unsafeUnwrap();
      expect(pricing.amount.cents).toBe(50000);
      expect(pricing.dueCategory).toBe(DueCategory.MEMBERSHIP);
      expect(pricing.effectiveFrom.value).toBe('2024-01-01');
      expect(pricing.effectiveTo).toBeNull();
      expect(pricing.memberCategory).toBe(MemberCategory.MEMBER);
      expect(pricing.createdBy).toBe(createdBy);
    });

    it('should create pricing for different due categories', () => {
      const props = {
        ...createValidPricingProps(),
        dueCategory: DueCategory.ELECTRICITY,
      };

      const result = PricingEntity.create(props, 'admin');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().dueCategory).toBe(DueCategory.ELECTRICITY);
    });

    it('should create pricing for different member categories', () => {
      const props = {
        ...createValidPricingProps(),
        memberCategory: MemberCategory.CADET,
      };

      const result = PricingEntity.create(props, 'admin');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().memberCategory).toBe(MemberCategory.CADET);
    });

    it('should add PricingCreatedEvent on creation', () => {
      const props = createValidPricingProps();

      const result = PricingEntity.create(props, 'admin');
      const pricing = result._unsafeUnwrap();
      const events = pricing.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PricingCreatedEvent);
      expect((events[0] as PricingCreatedEvent).pricing).toBe(pricing);
    });

    it('should generate unique ids for each pricing', () => {
      const props = createValidPricingProps();

      const result1 = PricingEntity.create(props, 'admin');
      const result2 = PricingEntity.create(props, 'admin');

      expect(result1._unsafeUnwrap().id.value).not.toBe(
        result2._unsafeUnwrap().id.value,
      );
    });
  });

  describe('fromPersistence', () => {
    it('should create a pricing from persisted data', () => {
      const id = UniqueId.generate();

      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(75000)._unsafeUnwrap(),
          dueCategory: DueCategory.GUEST,
          effectiveFrom: DateOnly.fromString('2024-03-01')._unsafeUnwrap(),
          effectiveTo: null,
          memberCategory: MemberCategory.ADHERENT_MEMBER,
        },
        {
          audit: {
            createdAt: new Date('2024-03-01'),
            createdBy: 'system',
            updatedAt: null,
            updatedBy: null,
          },
          deleted: {},
          id,
        },
      );

      expect(pricing.id).toBe(id);
      expect(pricing.amount.cents).toBe(75000);
      expect(pricing.dueCategory).toBe(DueCategory.GUEST);
      expect(pricing.memberCategory).toBe(MemberCategory.ADHERENT_MEMBER);
      expect(pricing.createdBy).toBe('system');
    });

    it('should create a closed pricing from persisted data', () => {
      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(40000)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString('2023-01-01')._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString('2023-12-31')._unsafeUnwrap(),
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: 'admin' },
          deleted: {},
          id: UniqueId.generate(),
        },
      );

      expect(pricing.effectiveTo?.value).toBe('2023-12-31');
    });

    it('should create a soft-deleted pricing from persisted data', () => {
      const deletedAt = new Date('2024-06-01');

      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(30000)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          effectiveTo: null,
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: 'admin' },
          deleted: { deletedAt, deletedBy: 'admin' },
          id: UniqueId.generate(),
        },
      );

      expect(pricing.deletedAt).toBe(deletedAt);
      expect(pricing.deletedBy).toBe('admin');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the pricing', () => {
      const props = createValidPricingProps();
      const original = PricingEntity.create(props, 'admin')._unsafeUnwrap();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.dueCategory).toBe(original.dueCategory);
      expect(cloned.effectiveFrom.value).toBe(original.effectiveFrom.value);
      expect(cloned.effectiveTo).toBe(original.effectiveTo);
      expect(cloned.memberCategory).toBe(original.memberCategory);
    });

    it('should create an independent copy', () => {
      const props = createValidPricingProps();
      const original = PricingEntity.create(props, 'admin')._unsafeUnwrap();
      const cloned = original.clone();

      original.close(
        DateOnly.fromString('2024-06-30')._unsafeUnwrap(),
        'admin',
      );

      expect(original.effectiveTo?.value).toBe('2024-06-30');
      expect(cloned.effectiveTo).toBeNull();
    });
  });

  describe('isActiveOn', () => {
    it('should return true for date within active period', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();

      const testDate = DateOnly.fromString('2024-06-15')._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(true);
    });

    it('should return true for date on effectiveFrom', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();

      const testDate = DateOnly.fromString('2024-01-01')._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(true);
    });

    it('should return false for date before effectiveFrom', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();

      const testDate = DateOnly.fromString('2023-12-31')._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(false);
    });

    it('should return false for date on effectiveTo (closed pricing)', () => {
      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(50000)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString('2024-06-30')._unsafeUnwrap(),
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: 'admin' },
          deleted: {},
          id: UniqueId.generate(),
        },
      );

      const testDate = DateOnly.fromString('2024-06-30')._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(false);
    });

    it('should return true for date before effectiveTo (closed pricing)', () => {
      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(50000)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString('2024-06-30')._unsafeUnwrap(),
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: 'admin' },
          deleted: {},
          id: UniqueId.generate(),
        },
      );

      const testDate = DateOnly.fromString('2024-06-29')._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(true);
    });
  });

  describe('close', () => {
    it('should close an open pricing', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();
      pricing.pullEvents(); // Clear creation event

      const effectiveTo = DateOnly.fromString('2024-12-31')._unsafeUnwrap();
      pricing.close(effectiveTo, 'admin-closer');

      expect(pricing.effectiveTo?.value).toBe('2024-12-31');
      expect(pricing.updatedBy).toBe('admin-closer');
    });

    it('should add PricingUpdatedEvent when closing', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();
      pricing.pullEvents();

      const effectiveTo = DateOnly.fromString('2024-12-31')._unsafeUnwrap();
      pricing.close(effectiveTo, 'admin');

      const events = pricing.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PricingUpdatedEvent);

      const event = events[0] as PricingUpdatedEvent;
      expect(event.oldPricing.effectiveTo).toBeNull();
      expect(event.pricing.effectiveTo?.value).toBe('2024-12-31');
    });
  });

  describe('update', () => {
    it('should update amount and effectiveFrom on open pricing', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();
      pricing.pullEvents();

      const result = pricing.update({
        amount: Amount.fromCents(60000)._unsafeUnwrap(),
        effectiveFrom: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
        updatedBy: 'admin-updater',
      });

      expect(result.isOk()).toBe(true);
      expect(pricing.amount.cents).toBe(60000);
      expect(pricing.effectiveFrom.value).toBe('2024-02-01');
      expect(pricing.updatedBy).toBe('admin-updater');
    });

    it('should add PricingUpdatedEvent when updating', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();
      pricing.pullEvents();

      pricing.update({
        amount: Amount.fromCents(75000)._unsafeUnwrap(),
        effectiveFrom: DateOnly.fromString('2024-03-01')._unsafeUnwrap(),
        updatedBy: 'admin',
      });

      const events = pricing.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PricingUpdatedEvent);

      const event = events[0] as PricingUpdatedEvent;
      expect(event.oldPricing.amount.cents).toBe(50000);
      expect(event.pricing.amount.cents).toBe(75000);
    });

    it('should fail to update a closed pricing', () => {
      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(50000)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString('2024-06-30')._unsafeUnwrap(),
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: 'admin' },
          deleted: {},
          id: UniqueId.generate(),
        },
      );

      const result = pricing.update({
        amount: Amount.fromCents(60000)._unsafeUnwrap(),
        effectiveFrom: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
        updatedBy: 'admin',
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede actualizar un precio cerrado',
      );
    });
  });

  describe('soft delete', () => {
    it('should delete the pricing', () => {
      const pricing = PricingEntity.create(
        createValidPricingProps(),
        'admin',
      )._unsafeUnwrap();

      const deleteDate = new Date('2024-06-15');
      pricing.delete('admin-deleter', deleteDate);

      expect(pricing.deletedAt).toBe(deleteDate);
      expect(pricing.deletedBy).toBe('admin-deleter');
    });

    it('should restore a deleted pricing', () => {
      const pricing = PricingEntity.fromPersistence(
        createValidPricingProps(),
        {
          audit: { createdBy: 'admin' },
          deleted: { deletedAt: new Date(), deletedBy: 'admin' },
          id: UniqueId.generate(),
        },
      );

      expect(pricing.deletedAt).toBeDefined();

      const restoreDate = new Date('2024-07-01');
      pricing.restore('admin-restorer', restoreDate);

      expect(pricing.deletedAt).toBeUndefined();
      expect(pricing.deletedBy).toBeUndefined();
      expect(pricing.updatedBy).toBe('admin-restorer');
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();

      const pricing1 = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(50000)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          effectiveTo: null,
          memberCategory: MemberCategory.MEMBER,
        },
        { audit: { createdBy: 'admin' }, deleted: {}, id },
      );

      const pricing2 = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(75000)._unsafeUnwrap(),
          dueCategory: DueCategory.ELECTRICITY,
          effectiveFrom: DateOnly.fromString('2024-06-01')._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString('2024-12-31')._unsafeUnwrap(),
          memberCategory: MemberCategory.CADET,
        },
        { audit: { createdBy: 'system' }, deleted: {}, id },
      );

      expect(pricing1.equals(pricing2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const props = createValidPricingProps();

      const pricing1 = PricingEntity.create(props, 'admin')._unsafeUnwrap();
      const pricing2 = PricingEntity.create(props, 'admin')._unsafeUnwrap();

      expect(pricing1.equals(pricing2)).toBe(false);
    });
  });

  describe('different due categories', () => {
    const dueCategories = Object.values(DueCategory);

    it.each(dueCategories)(
      'should create pricing with due category %s',
      (dueCategory) => {
        const props = { ...createValidPricingProps(), dueCategory };

        const result = PricingEntity.create(props, 'admin');

        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap().dueCategory).toBe(dueCategory);
      },
    );
  });

  describe('different member categories', () => {
    const memberCategories = Object.values(MemberCategory);

    it.each(memberCategories)(
      'should create pricing with member category %s',
      (memberCategory) => {
        const props = { ...createValidPricingProps(), memberCategory };

        const result = PricingEntity.create(props, 'admin');

        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap().memberCategory).toBe(memberCategory);
      },
    );
  });
});
