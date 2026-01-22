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
import { GroupEntity } from '@/groups/domain/entities/group.entity';
import { GroupCreatedEvent } from '@/groups/domain/events/group-created.event';
import { GroupUpdatedEvent } from '@/groups/domain/events/group-updated.event';
import { MemberEntity } from '@/members/domain/entities/member.entity';
import { MemberCreatedEvent } from '@/members/domain/events/member-created.event';
import { MemberUpdatedEvent } from '@/members/domain/events/member-updated.event';
import { MemberLedgerEntryEntity } from '@/members/ledger/domain/entities/member-ledger-entry.entity';
import { MemberLedgerEntryCreatedEvent } from '@/members/ledger/domain/events/member-ledger-entry-created.event';
import { MemberLedgerEntryUpdatedEvent } from '@/members/ledger/domain/events/member-ledger-entry-updated.event';
import { MovementEntity } from '@/movements/domain/entities/movement.entity';
import { MovementCreatedEvent } from '@/movements/domain/events/movement-created.event';
import { MovementUpdatedEvent } from '@/movements/domain/events/movement-updated.event';
import { EmailSuppressionEntity } from '@/notifications/domain/entities/email-suppression.entity';
import { NotificationEntity } from '@/notifications/domain/entities/notification.entity';
import { EmailSuppressionCreatedEvent } from '@/notifications/domain/events/email-suppression-created.event';
import { NotificationCreatedEvent } from '@/notifications/domain/events/notification-created.event';
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
    Guard.string(event.newDue.createdBy);

    const action = event.newDue.isVoided()
      ? AuditAction.VOIDED
      : AuditAction.UPDATED;
    const message = event.newDue.isVoided() ? 'Due voided' : 'Due updated';

    await this.createAuditLog({
      action,
      createdBy: event.newDue.createdBy,
      entity: AuditEntity.DUE,
      entityId: event.newDue.id.value,
      message,
      newData: this.serializeDue(event.newDue),
      oldData: this.serializeDue(event.oldDue),
    });
  }

  // Email Suppression Events
  @OnEvent(EmailSuppressionCreatedEvent.name)
  public async handleEmailSuppressionCreated(
    event: EmailSuppressionCreatedEvent,
  ): Promise<void> {
    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.emailSuppression.createdBy,
      entity: AuditEntity.EMAIL_SUPPRESSION,
      entityId: event.emailSuppression.id.value,
      message: 'Email suppression created',
      newData: this.serializeEmailSuppression(event.emailSuppression),
      oldData: null,
    });
  }

  // Group Events
  @OnEvent(GroupCreatedEvent.name)
  public async handleGroupCreated(event: GroupCreatedEvent): Promise<void> {
    Guard.string(event.group.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.group.createdBy,
      entity: AuditEntity.GROUP,
      entityId: event.group.id.value,
      message: 'Group created',
      newData: this.serializeGroup(event.group),
      oldData: null,
    });
  }

  @OnEvent(GroupUpdatedEvent.name)
  public async handleGroupUpdated(event: GroupUpdatedEvent): Promise<void> {
    Guard.string(event.newGroup.createdBy);

    await this.createAuditLog({
      action: AuditAction.UPDATED,
      createdBy: event.newGroup.createdBy,
      entity: AuditEntity.GROUP,
      entityId: event.newGroup.id.value,
      message: 'Group updated',
      newData: this.serializeGroup(event.newGroup),
      oldData: this.serializeGroup(event.oldGroup),
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

  // Member Ledger Entry Events
  @OnEvent(MemberLedgerEntryCreatedEvent.name)
  public async handleMemberLedgerEntryCreated(
    event: MemberLedgerEntryCreatedEvent,
  ): Promise<void> {
    Guard.string(event.memberLedgerEntry.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.memberLedgerEntry.createdBy,
      entity: AuditEntity.MEMBER_LEDGER_ENTRY,
      entityId: event.memberLedgerEntry.id.value,
      message: 'Member ledger entry created',
      newData: this.serializeMemberLedgerEntry(event.memberLedgerEntry),
      oldData: null,
    });
  }

  @OnEvent(MemberLedgerEntryUpdatedEvent.name)
  public async handleMemberLedgerEntryUpdated(
    event: MemberLedgerEntryUpdatedEvent,
  ): Promise<void> {
    Guard.string(event.newMemberLedgerEntry.createdBy);

    await this.createAuditLog({
      action: AuditAction.UPDATED,
      createdBy: event.newMemberLedgerEntry.createdBy,
      entity: AuditEntity.MEMBER_LEDGER_ENTRY,
      entityId: event.newMemberLedgerEntry.id.value,
      message: 'Member ledger entry updated',
      newData: this.serializeMemberLedgerEntry(event.newMemberLedgerEntry),
      oldData: this.serializeMemberLedgerEntry(event.oldMemberLedgerEntry),
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

  // Notification Events
  @OnEvent(NotificationCreatedEvent.name)
  public async handleNotificationCreated(
    event: NotificationCreatedEvent,
  ): Promise<void> {
    Guard.string(event.notification.createdBy);

    await this.createAuditLog({
      action: AuditAction.CREATED,
      createdBy: event.notification.createdBy,
      entity: AuditEntity.NOTIFICATION,
      entityId: event.notification.id.value,
      message: 'Notification created',
      newData: this.serializeNotification(event.notification),
      oldData: null,
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
      amount: due.amount.cents,
      category: due.category,
      createdAt: due.createdAt,
      createdBy: due.createdBy,
      date: due.date.value,
      id: due.id.value,
      memberId: due.memberId.value,
      notes: due.notes,
      settlements: due.settlements.map((settlement) => ({
        amount: settlement.amount.cents,
        dueId: settlement.dueId.value,
        id: settlement.id.value,
        memberLedgerEntryId: settlement.memberLedgerEntryId.value,
        paymentId: settlement.paymentId?.value ?? null,
        status: settlement.status,
      })),
      status: due.status,
      updatedAt: due.updatedAt,
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }

  private serializeEmailSuppression(
    emailSuppression: EmailSuppressionEntity,
  ): Record<string, unknown> {
    return {
      createdAt: emailSuppression.createdAt,
      createdBy: emailSuppression.createdBy,
      email: emailSuppression.email,
      id: emailSuppression.id.value,
      providerData: emailSuppression.providerData,
      providerEventId: emailSuppression.providerEventId,
      reason: emailSuppression.reason,
    };
  }

  private serializeGroup(group: GroupEntity): Record<string, unknown> {
    return {
      createdAt: group.createdAt,
      createdBy: group.createdBy,
      id: group.id.value,
      members: group.members.map((member) => ({
        groupId: member.groupId.value,
        id: member.memberId.value,
        memberId: member.memberId.value,
      })),
      name: group.name,
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
      status: member.status,
      updatedAt: member.updatedAt,
      updatedBy: member.updatedBy,
      userId: member.userId.value,
    };
  }

  private serializeMemberLedgerEntry(
    memberLedgerEntry: MemberLedgerEntryEntity,
  ): Record<string, unknown> {
    return {
      amount: memberLedgerEntry.amount.cents,
      createdAt: memberLedgerEntry.createdAt,
      createdBy: memberLedgerEntry.createdBy,
      date: memberLedgerEntry.date.value,
      id: memberLedgerEntry.id.value,
      memberId: memberLedgerEntry.memberId.value,
      notes: memberLedgerEntry.notes,
      paymentId: memberLedgerEntry.paymentId?.value ?? null,
      reversalOfId: memberLedgerEntry.reversalOfId?.value ?? null,
      source: memberLedgerEntry.source,
      status: memberLedgerEntry.status,
      type: memberLedgerEntry.type,
      updatedAt: memberLedgerEntry.updatedAt,
      updatedBy: memberLedgerEntry.updatedBy,
    };
  }

  private serializeMovement(movement: MovementEntity): Record<string, unknown> {
    return {
      amount: movement.amount.cents,
      category: movement.category,
      createdAt: movement.createdAt,
      createdBy: movement.createdBy,
      date: movement.date.value,
      id: movement.id.value,
      notes: movement.notes,
      paymentId: movement.paymentId?.value ?? null,
      status: movement.status,
      updatedAt: movement.updatedAt,
      updatedBy: movement.updatedBy,
      voidedAt: movement.voidedAt,
      voidedBy: movement.voidedBy,
      voidReason: movement.voidReason,
    };
  }

  private serializeNotification(
    notification: NotificationEntity,
  ): Record<string, unknown> {
    return {
      attempts: notification.attempts,
      channel: notification.channel,
      createdAt: notification.createdAt,
      createdBy: notification.createdBy,
      deliveredAt: notification.deliveredAt,
      id: notification.id.value,
      lastError: notification.lastError,
      maxAttempts: notification.maxAttempts,
      payload: notification.payload,
      processedAt: notification.processedAt,
      providerMessageId: notification.providerMessageId,
      queuedAt: notification.queuedAt,
      recipientAddress: notification.recipientAddress,
      scheduledAt: notification.scheduledAt,
      sentAt: notification.sentAt,
      sourceEntity: notification.sourceEntity,
      sourceEntityId: notification.sourceEntityId?.value ?? null,
      status: notification.status,
      type: notification.type,
      updatedAt: notification.updatedAt,
      updatedBy: notification.updatedBy,
      userId: notification.userId.value,
    };
  }

  private serializePayment(payment: PaymentEntity): Record<string, unknown> {
    return {
      amount: payment.amount.cents,
      createdAt: payment.createdAt,
      createdBy: payment.createdBy,
      date: payment.date.value,
      dueIds: payment.dueIds.map((dueId) => dueId.value),
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
      amount: pricing.amount.cents,
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
      firstName: user.name.firstName,
      id: user.id.value,
      lastName: user.name.lastName,
      notificationPreferences: user.notificationPreferences.toJson(),
      preferences: user.preferences.toJson(),
      role: user.role,
      status: user.status,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
