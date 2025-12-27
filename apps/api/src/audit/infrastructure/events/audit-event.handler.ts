import { AuditAction, AuditEntity } from '@club-social/shared/audit-logs';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InputJsonValue } from '@prisma/client/runtime/client';

import {
  AUDIT_LOG_REPOSITORY_PROVIDER,
  type AuditLogRepository,
} from '@/audit/domain/audit-log.repository';
import { DueEntity } from '@/dues/domain/entities/due.entity';
import { DueCreatedEvent } from '@/dues/domain/events/due-created.event';
import { DueUpdatedEvent } from '@/dues/domain/events/due-updated.event';
import { MemberEntity } from '@/members/domain/entities/member.entity';
import { MemberCreatedEvent } from '@/members/domain/events/member-created.event';
import { MemberUpdatedEvent } from '@/members/domain/events/member-updated.event';
import { MovementEntity } from '@/movements/domain/entities/movement.entity';
import { MovementCreatedEvent } from '@/movements/domain/events/movement-created.event';
import { MovementUpdatedEvent } from '@/movements/domain/events/movement-updated.event';
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import { PaymentCreatedEvent } from '@/payments/domain/events/payment-created.event';
import { PaymentUpdatedEvent } from '@/payments/domain/events/payment-updated.event';
import { PricingEntity } from '@/pricing/domain/entities/pricing.entity';
import { PricingCreatedEvent } from '@/pricing/domain/events/pricing-created.event';
import { PricingUpdatedEvent } from '@/pricing/domain/events/pricing-updated.event';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { Guard } from '@/shared/domain/guards';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserCreatedEvent } from '@/users/domain/events/user-created.event';
import { UserUpdatedEvent } from '@/users/domain/events/user-updated.event';

@Injectable()
export class AuditEventHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @Inject(AUDIT_LOG_REPOSITORY_PROVIDER)
    private readonly auditLogRepository: AuditLogRepository,
  ) {
    this.logger.setContext(AuditEventHandler.name);
  }

  // Due Events
  @OnEvent(DueCreatedEvent.name)
  public async handleDueCreated(event: DueCreatedEvent): Promise<void> {
    Guard.string(event.due.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.due.createdBy,
      entity: AuditEntity.DUE,
      entityId: event.due.id.value,
      message: 'Due created',
      newData: this.serializeDue(event.due),
      oldData: null,
    });
  }

  @OnEvent(DueUpdatedEvent.name)
  public async handleDueUpdated(event: DueUpdatedEvent): Promise<void> {
    Guard.string(event.due.createdBy);

    const action = event.due.isVoided()
      ? AuditAction.VOIDED
      : AuditAction.UPDATED;
    const message = event.due.isVoided() ? 'Due voided' : 'Due updated';

    await this.createAuditLog({
      action,
      createdBy: event.due.createdBy,
      entity: AuditEntity.DUE,
      entityId: event.due.id.value,
      message,
      newData: this.serializeDue(event.due),
      oldData: this.serializeDue(event.oldDue),
    });
  }

  // Member Events
  @OnEvent(MemberCreatedEvent.name)
  public async handleMemberCreated(event: MemberCreatedEvent): Promise<void> {
    Guard.string(event.member.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.member.createdBy,
      entity: AuditEntity.MEMBER,
      entityId: event.member.id.value,
      message: 'Member created',
      newData: this.serializeMember(event.member),
      oldData: null,
    });
  }

  @OnEvent(MemberUpdatedEvent.name)
  public async handleMemberUpdated(event: MemberUpdatedEvent): Promise<void> {
    Guard.string(event.member.createdBy);

    await this.createAuditLog({
      action: AuditAction.UPDATED,
      createdBy: event.member.createdBy,
      entity: AuditEntity.MEMBER,
      entityId: event.member.id.value,
      message: 'Member updated',
      newData: this.serializeMember(event.member),
      oldData: this.serializeMember(event.oldMember),
    });
  }

  // Movement Events
  @OnEvent(MovementCreatedEvent.name)
  public async handleMovementCreated(
    event: MovementCreatedEvent,
  ): Promise<void> {
    Guard.string(event.movement.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.movement.createdBy,
      entity: AuditEntity.MOVEMENT,
      entityId: event.movement.id.value,
      message: 'Movement created',
      newData: this.serializeMovement(event.movement),
      oldData: null,
    });
  }

  @OnEvent(MovementUpdatedEvent.name)
  public async handleMovementUpdated(
    event: MovementUpdatedEvent,
  ): Promise<void> {
    Guard.string(event.movement.createdBy);

    const action = event.movement.isVoided()
      ? AuditAction.VOIDED
      : AuditAction.UPDATED;
    const message = event.movement.isVoided()
      ? 'Movement voided'
      : 'Movement updated';

    await this.createAuditLog({
      action,
      createdBy: event.movement.createdBy,
      entity: AuditEntity.MOVEMENT,
      entityId: event.movement.id.value,
      message,
      newData: this.serializeMovement(event.movement),
      oldData: this.serializeMovement(event.oldMovement),
    });
  }

  // Payment Events
  @OnEvent(PaymentCreatedEvent.name)
  public async handlePaymentCreated(event: PaymentCreatedEvent): Promise<void> {
    Guard.string(event.payment.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.payment.createdBy,
      entity: AuditEntity.PAYMENT,
      entityId: event.payment.id.value,
      message: 'Payment created',
      newData: this.serializePayment(event.payment),
      oldData: null,
    });
  }

  @OnEvent(PaymentUpdatedEvent.name)
  public async handlePaymentUpdated(event: PaymentUpdatedEvent): Promise<void> {
    Guard.string(event.payment.createdBy);

    const action = event.payment.isVoided()
      ? AuditAction.VOIDED
      : AuditAction.UPDATED;
    const message = event.payment.isVoided()
      ? 'Payment voided'
      : 'Payment updated';

    await this.createAuditLog({
      action,
      createdBy: event.payment.createdBy,
      entity: AuditEntity.PAYMENT,
      entityId: event.payment.id.value,
      message,
      newData: this.serializePayment(event.payment),
      oldData: this.serializePayment(event.oldPayment),
    });
  }

  // Pricing Events
  @OnEvent(PricingCreatedEvent.name)
  public async handlePricingCreated(event: PricingCreatedEvent): Promise<void> {
    Guard.string(event.pricing.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.pricing.createdBy,
      entity: AuditEntity.PRICING,
      entityId: event.pricing.id.value,
      message: 'Pricing created',
      newData: this.serializePricing(event.pricing),
      oldData: null,
    });
  }

  @OnEvent(PricingUpdatedEvent.name)
  public async handlePricingUpdated(event: PricingUpdatedEvent): Promise<void> {
    Guard.string(event.pricing.createdBy);

    await this.createAuditLog({
      action: AuditAction.UPDATED,
      createdBy: event.pricing.createdBy,
      entity: AuditEntity.PRICING,
      entityId: event.pricing.id.value,
      message: 'Pricing updated',
      newData: this.serializePricing(event.pricing),
      oldData: this.serializePricing(event.oldPricing),
    });
  }

  // User Events
  @OnEvent(UserCreatedEvent.name)
  public async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    Guard.string(event.user.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.user.createdBy,
      entity: AuditEntity.USER,
      entityId: event.user.id.value,
      message: 'User created',
      newData: this.serializeUser(event.user),
      oldData: null,
    });
  }

  @OnEvent(UserUpdatedEvent.name)
  public async handleUserUpdated(event: UserUpdatedEvent): Promise<void> {
    Guard.string(event.user.createdBy);

    await this.createAuditLog({
      action: AuditAction.UPDATED,
      createdBy: event.user.createdBy,
      entity: AuditEntity.USER,
      entityId: event.user.id.value,
      message: 'User updated',
      newData: this.serializeUser(event.user),
      oldData: this.serializeUser(event.oldUser),
    });
  }

  private async createAuditLog(props: {
    action: AuditAction;
    createdBy: string;
    entity: AuditEntity;
    entityId: string;
    message: string;
    newData: null | Record<string, unknown>;
    oldData: null | Record<string, unknown>;
  }): Promise<void> {
    try {
      await this.auditLogRepository.append({
        action: props.action,
        createdBy: props.createdBy,
        entity: props.entity,
        entityId: props.entityId,
        id: UniqueId.generate().value,
        message: props.message,
        newData: props.newData as InputJsonValue | undefined,
        oldData: props.oldData as InputJsonValue | undefined,
      });

      this.logger.info({
        action: props.action,
        entity: props.entity,
        entityId: props.entityId,
        message: `Audit log created: ${props.message}`,
      });
    } catch (error) {
      this.logger.error({
        error,
        message: 'Failed to create audit log',
        props,
      });
    }
  }

  private serializeDue(due: DueEntity): Record<string, unknown> {
    return {
      amount: due.amount.toCents(),
      category: due.category,
      createdAt: due.createdAt,
      createdBy: due.createdBy,
      date: due.date.value,
      id: due.id.value,
      memberId: due.memberId.value,
      notes: due.notes,
      status: due.status,
      updatedAt: due.updatedAt,
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }

  private serializeMember(member: MemberEntity): Record<string, unknown> {
    return {
      address: member.address
        ? {
            cityName: member.address.cityName,
            stateName: member.address.stateName,
            street: member.address.street,
            zipCode: member.address.zipCode,
          }
        : null,
      birthDate: member.birthDate?.value ?? null,
      category: member.category,
      createdAt: member.createdAt,
      createdBy: member.createdBy,
      documentID: member.documentID,
      fileStatus: member.fileStatus,
      id: member.id.value,
      maritalStatus: member.maritalStatus,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      updatedAt: member.updatedAt,
      updatedBy: member.updatedBy,
      userId: member.userId.value,
    };
  }

  private serializeMovement(movement: MovementEntity): Record<string, unknown> {
    return {
      amount: movement.amount.toCents(),
      category: movement.category,
      createdAt: movement.createdAt,
      createdBy: movement.createdBy,
      date: movement.date.value,
      id: movement.id.value,
      notes: movement.notes,
      paymentId: movement.paymentId?.value ?? null,
      status: movement.status,
      type: movement.type,
      updatedAt: movement.updatedAt,
      updatedBy: movement.updatedBy,
      voidedAt: movement.voidedAt,
      voidedBy: movement.voidedBy,
      voidReason: movement.voidReason,
    };
  }

  private serializePayment(payment: PaymentEntity): Record<string, unknown> {
    return {
      amount: payment.amount.toCents(),
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date.value,
      dueIds: payment.dueIds.map((id) => id.value),
      id: payment.id.value,
      memberId: payment.memberId.value,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status,
      updatedAt: payment.updatedAt,
      updatedBy: payment.updatedBy,
      voidedAt: payment.voidedAt,
      voidedBy: payment.voidedBy,
      voidReason: payment.voidReason,
    };
  }

  private serializePricing(pricing: PricingEntity): Record<string, unknown> {
    return {
      amount: pricing.amount.toCents(),
      createdAt: pricing.createdAt,
      createdBy: pricing.createdBy,
      deletedAt: pricing.deletedAt,
      deletedBy: pricing.deletedBy,
      dueCategory: pricing.dueCategory,
      effectiveFrom: pricing.effectiveFrom.value,
      effectiveTo: pricing.effectiveTo?.value ?? null,
      id: pricing.id.value,
      memberCategory: pricing.memberCategory,
      updatedAt: pricing.updatedAt,
      updatedBy: pricing.updatedBy,
    };
  }

  private serializeUser(user: UserEntity): Record<string, unknown> {
    return {
      banExpires: user.banExpires,
      banned: user.banned,
      banReason: user.banReason,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      deletedAt: user.deletedAt,
      deletedBy: user.deletedBy,
      email: user.email.value,
      firstName: user.firstName,
      id: user.id.value,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
