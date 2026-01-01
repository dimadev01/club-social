import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ALT_PRICING_AMOUNT_CENTS,
  TEST_ALT_PRICING_EFFECTIVE_FROM,
  TEST_ALT_PRICING_EFFECTIVE_TO,
  TEST_CREATED_BY,
  TEST_PRICING_AMOUNT_CENTS,
  TEST_PRICING_EFFECTIVE_FROM,
} from '@/shared/test/constants';
import { createPricingProps, createTestPricing } from '@/shared/test/factories';

import { PricingCreatedEvent } from '../events/pricing-created.event';
import { PricingUpdatedEvent } from '../events/pricing-updated.event';
import { PricingEntity } from './pricing.entity';

describe('PricingEntity', () => {
  describe('create', () => {
    it('should create a pricing with valid props', () => {
      const props = createPricingProps();

      const result = PricingEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const pricing = result._unsafeUnwrap();
      expect(pricing.amount.cents).toBe(TEST_PRICING_AMOUNT_CENTS);
      expect(pricing.dueCategory).toBe(DueCategory.MEMBERSHIP);
      expect(pricing.effectiveFrom.value).toBe(TEST_PRICING_EFFECTIVE_FROM);
      expect(pricing.effectiveTo).toBeNull();
      expect(pricing.memberCategory).toBe(MemberCategory.MEMBER);
      expect(pricing.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create pricing for different due categories', () => {
      const pricing = createTestPricing({
        dueCategory: DueCategory.ELECTRICITY,
      });

      expect(pricing.dueCategory).toBe(DueCategory.ELECTRICITY);
    });

    it('should create pricing for different member categories', () => {
      const pricing = createTestPricing({
        memberCategory: MemberCategory.CADET,
      });

      expect(pricing.memberCategory).toBe(MemberCategory.CADET);
    });

    it('should add PricingCreatedEvent on creation', () => {
      const pricing = createTestPricing();
      const events = pricing.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PricingCreatedEvent);
      expect((events[0] as PricingCreatedEvent).pricing).toBe(pricing);
    });

    it('should generate unique ids for each pricing', () => {
      const pricing1 = createTestPricing();
      const pricing2 = createTestPricing();

      expect(pricing1.id.value).not.toBe(pricing2.id.value);
    });
  });

  describe('fromPersistence', () => {
    it('should create a pricing from persisted data', () => {
      const id = UniqueId.generate();

      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(
            TEST_ALT_PRICING_AMOUNT_CENTS,
          )._unsafeUnwrap(),
          dueCategory: DueCategory.GUEST,
          effectiveFrom: DateOnly.fromString(
            TEST_ALT_PRICING_EFFECTIVE_FROM,
          )._unsafeUnwrap(),
          effectiveTo: null,
          memberCategory: MemberCategory.ADHERENT_MEMBER,
        },
        {
          audit: {
            createdAt: new Date(TEST_ALT_PRICING_EFFECTIVE_FROM),
            createdBy: 'system',
            updatedAt: null,
            updatedBy: null,
          },
          deleted: {},
          id,
        },
      );

      expect(pricing.id).toBe(id);
      expect(pricing.amount.cents).toBe(TEST_ALT_PRICING_AMOUNT_CENTS);
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
          audit: { createdBy: TEST_CREATED_BY },
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
          effectiveFrom: DateOnly.fromString(
            TEST_PRICING_EFFECTIVE_FROM,
          )._unsafeUnwrap(),
          effectiveTo: null,
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          deleted: { deletedAt, deletedBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      expect(pricing.deletedAt).toBe(deletedAt);
      expect(pricing.deletedBy).toBe(TEST_CREATED_BY);
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the pricing', () => {
      const original = createTestPricing();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.dueCategory).toBe(original.dueCategory);
      expect(cloned.effectiveFrom.value).toBe(original.effectiveFrom.value);
      expect(cloned.effectiveTo).toBe(original.effectiveTo);
      expect(cloned.memberCategory).toBe(original.memberCategory);
    });

    it('should create an independent copy', () => {
      const original = createTestPricing();
      original.pullEvents();
      const cloned = original.clone();

      original.close(
        DateOnly.fromString(TEST_ALT_PRICING_EFFECTIVE_TO)._unsafeUnwrap(),
        TEST_CREATED_BY,
      );

      expect(original.effectiveTo?.value).toBe(TEST_ALT_PRICING_EFFECTIVE_TO);
      expect(cloned.effectiveTo).toBeNull();
    });
  });

  describe('isActiveOn', () => {
    it('should return true for date within active period', () => {
      const pricing = createTestPricing();
      const testDate = DateOnly.fromString('2024-06-15')._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(true);
    });

    it('should return true for date on effectiveFrom', () => {
      const pricing = createTestPricing();
      const testDate = DateOnly.fromString(
        TEST_PRICING_EFFECTIVE_FROM,
      )._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(true);
    });

    it('should return false for date before effectiveFrom', () => {
      const pricing = createTestPricing();
      const testDate = DateOnly.fromString('2023-12-31')._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(false);
    });

    it('should return false for date on effectiveTo (closed pricing)', () => {
      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(TEST_PRICING_AMOUNT_CENTS)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString(
            TEST_PRICING_EFFECTIVE_FROM,
          )._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString(
            TEST_ALT_PRICING_EFFECTIVE_TO,
          )._unsafeUnwrap(),
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          deleted: {},
          id: UniqueId.generate(),
        },
      );

      const testDate = DateOnly.fromString(
        TEST_ALT_PRICING_EFFECTIVE_TO,
      )._unsafeUnwrap();

      expect(pricing.isActiveOn(testDate)).toBe(false);
    });

    it('should return true for date before effectiveTo (closed pricing)', () => {
      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(TEST_PRICING_AMOUNT_CENTS)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString(
            TEST_PRICING_EFFECTIVE_FROM,
          )._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString(
            TEST_ALT_PRICING_EFFECTIVE_TO,
          )._unsafeUnwrap(),
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
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
      const pricing = createTestPricing();
      pricing.pullEvents();

      const effectiveTo = DateOnly.fromString('2024-12-31')._unsafeUnwrap();
      pricing.close(effectiveTo, TEST_CREATED_BY);

      expect(pricing.effectiveTo?.value).toBe('2024-12-31');
      expect(pricing.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should add PricingUpdatedEvent when closing', () => {
      const pricing = createTestPricing();
      pricing.pullEvents();

      const effectiveTo = DateOnly.fromString('2024-12-31')._unsafeUnwrap();
      pricing.close(effectiveTo, TEST_CREATED_BY);

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
      const pricing = createTestPricing();
      pricing.pullEvents();

      const result = pricing.update({
        amount: Amount.fromCents(60000)._unsafeUnwrap(),
        effectiveFrom: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
        updatedBy: TEST_CREATED_BY,
      });

      expect(result.isOk()).toBe(true);
      expect(pricing.amount.cents).toBe(60000);
      expect(pricing.effectiveFrom.value).toBe('2024-02-01');
      expect(pricing.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should add PricingUpdatedEvent when updating', () => {
      const pricing = createTestPricing();
      pricing.pullEvents();

      pricing.update({
        amount: Amount.fromCents(TEST_ALT_PRICING_AMOUNT_CENTS)._unsafeUnwrap(),
        effectiveFrom: DateOnly.fromString(
          TEST_ALT_PRICING_EFFECTIVE_FROM,
        )._unsafeUnwrap(),
        updatedBy: TEST_CREATED_BY,
      });

      const events = pricing.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PricingUpdatedEvent);

      const event = events[0] as PricingUpdatedEvent;
      expect(event.oldPricing.amount.cents).toBe(TEST_PRICING_AMOUNT_CENTS);
      expect(event.pricing.amount.cents).toBe(TEST_ALT_PRICING_AMOUNT_CENTS);
    });

    it('should fail to update a closed pricing', () => {
      const pricing = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(TEST_PRICING_AMOUNT_CENTS)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString(
            TEST_PRICING_EFFECTIVE_FROM,
          )._unsafeUnwrap(),
          effectiveTo: DateOnly.fromString(
            TEST_ALT_PRICING_EFFECTIVE_TO,
          )._unsafeUnwrap(),
          memberCategory: MemberCategory.MEMBER,
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          deleted: {},
          id: UniqueId.generate(),
        },
      );

      const result = pricing.update({
        amount: Amount.fromCents(60000)._unsafeUnwrap(),
        effectiveFrom: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
        updatedBy: TEST_CREATED_BY,
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede actualizar un precio cerrado',
      );
    });
  });

  describe('soft delete', () => {
    it('should delete the pricing', () => {
      const pricing = createTestPricing();

      const deleteDate = new Date('2024-06-15');
      pricing.delete(TEST_CREATED_BY, deleteDate);

      expect(pricing.deletedAt).toBe(deleteDate);
      expect(pricing.deletedBy).toBe(TEST_CREATED_BY);
    });

    it('should restore a deleted pricing', () => {
      const pricing = PricingEntity.fromPersistence(
        { ...createPricingProps(), effectiveTo: null },
        {
          audit: { createdBy: TEST_CREATED_BY },
          deleted: { deletedAt: new Date(), deletedBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      expect(pricing.deletedAt).toBeDefined();

      const restoreDate = new Date('2024-07-01');
      pricing.restore(TEST_CREATED_BY, restoreDate);

      expect(pricing.deletedAt).toBeUndefined();
      expect(pricing.deletedBy).toBeUndefined();
      expect(pricing.updatedBy).toBe(TEST_CREATED_BY);
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();

      const pricing1 = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(TEST_PRICING_AMOUNT_CENTS)._unsafeUnwrap(),
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: DateOnly.fromString(
            TEST_PRICING_EFFECTIVE_FROM,
          )._unsafeUnwrap(),
          effectiveTo: null,
          memberCategory: MemberCategory.MEMBER,
        },
        { audit: { createdBy: TEST_CREATED_BY }, deleted: {}, id },
      );

      const pricing2 = PricingEntity.fromPersistence(
        {
          amount: Amount.fromCents(
            TEST_ALT_PRICING_AMOUNT_CENTS,
          )._unsafeUnwrap(),
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
      const pricing1 = createTestPricing();
      const pricing2 = createTestPricing();

      expect(pricing1.equals(pricing2)).toBe(false);
    });
  });

  describe('different due categories', () => {
    const dueCategories = Object.values(DueCategory);

    it.each(dueCategories)(
      'should create pricing with due category %s',
      (dueCategory) => {
        const pricing = createTestPricing({ dueCategory });

        expect(pricing.dueCategory).toBe(dueCategory);
      },
    );
  });

  describe('different member categories', () => {
    const memberCategories = Object.values(MemberCategory);

    it.each(memberCategories)(
      'should create pricing with member category %s',
      (memberCategory) => {
        const pricing = createTestPricing({ memberCategory });

        expect(pricing.memberCategory).toBe(memberCategory);
      },
    );
  });
});
