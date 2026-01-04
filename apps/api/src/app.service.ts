/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuditAction, AuditEntity } from '@club-social/shared/audit-logs';
import {
  DueCategory,
  DueSettlementStatus,
  DueStatus,
} from '@club-social/shared/dues';
import { DateFormat } from '@club-social/shared/lib';
import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';
import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';
import { PaymentStatus } from '@club-social/shared/payments';
import { UserRole, UserStatus } from '@club-social/shared/users';
import { faker } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { sample, times } from 'es-toolkit/compat';
import { Connection } from 'mongoose';
import pLimit from 'p-limit';

import { ConfigService } from './infrastructure/config/config.service';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { CreateMemberUseCase } from './members/application/create-member.use-case';
import { VoidPaymentUseCase } from './payments/application/void-payment.use-case';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from './shared/application/app-logger';
import { Guard } from './shared/domain/guards';
import { Address } from './shared/domain/value-objects/address/address.vo';
import { DateOnly } from './shared/domain/value-objects/date-only/date-only.vo';
import { Name } from './shared/domain/value-objects/name/name.vo';
import { UniqueId } from './shared/domain/value-objects/unique-id/unique-id.vo';
import { CreateUserUseCase } from './users/application/create-user.use-case';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from './users/domain/user.repository';
import { DEFAULT_USER_PREFERENCES } from './users/domain/value-objects/user-preferences.vo';

@Injectable()
export class AppService {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly voidPayment: VoidPaymentUseCase,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @InjectConnection()
    private readonly mongoConnection: Connection,
  ) {}

  public async clear(): Promise<void> {
    await this.prismaService.auditLog.deleteMany({});
    await this.prismaService.dueSettlement.deleteMany({});
    await this.prismaService.payment.deleteMany({});
    await this.prismaService.due.deleteMany({});
    await this.prismaService.movement.deleteMany({});
    await this.prismaService.pricing.deleteMany({});
    await this.prismaService.memberLedgerEntry.deleteMany({});
    await this.prismaService.member.deleteMany({});

    await this.prismaService.session.deleteMany({});
    await this.prismaService.account.deleteMany({});
    await this.prismaService.verification.deleteMany({});
    await this.prismaService.passkey.deleteMany({});
    await this.prismaService.user.deleteMany({});
  }

  public getHello(): string {
    return 'Hello World!';
  }

  public async migrate() {
    await this.clear();

    const membersMap = new Map<string, string>();
    const duesMap = new Map<string, string>();
    const paymentsMap = new Map<string, string>();
    const movementsMap = new Map<string, string>();

    const BATCH_SIZE = 100;
    const limit = pLimit(10);

    const mongoMovementsCategoryMap = {
      buffet: MovementCategory.BUFFET,
      'court-rental': MovementCategory.COURT_RENTAL,
      employee: MovementCategory.EMPLOYEE,
      expense: MovementCategory.EXPENSE,
      fair: MovementCategory.FAIR,
      maintenance: MovementCategory.MAINTENANCE,
      'member-payment': MovementCategory.MEMBER_LEDGER,
      'other-expense': MovementCategory.OTHER,
      'other-income': MovementCategory.OTHER,
      parking: MovementCategory.PARKING,
      professor: MovementCategory.PROFESSOR,
      salary: MovementCategory.EMPLOYEE,
      saloon: MovementCategory.SALOON,
      saving: MovementCategory.OTHER,
      service: MovementCategory.UTILITIES,
    };

    const eventEntityMap = {
      dues: AuditEntity.DUE,
      members: AuditEntity.MEMBER,
      movements: AuditEntity.MOVEMENT,
      payments: AuditEntity.PAYMENT,
      prices: AuditEntity.PRICING,
    };

    const eventEntitiesMap = {
      dues: duesMap,
      members: membersMap,
      movements: movementsMap,
      payments: paymentsMap,
    };

    const eventActionMap = {
      create: AuditAction.CREATED,
      update: AuditAction.UPDATED,
      void: AuditAction.VOIDED,
    };

    // Process users/members in batches
    this.logger.info({ message: 'Starting users/members migration...' });
    let usersSkip = 0;

    while (true) {
      const mongoUsers = await this.mongoConnection
        .collection('users')
        .find({ isDeleted: false })
        .skip(usersSkip)
        .limit(BATCH_SIZE)
        .toArray();

      if (mongoUsers.length === 0) break;

      // Fetch members for this batch of users
      const userIds = mongoUsers.map((u) => u._id);
      const mongoMembers = await this.mongoConnection
        .collection('members')
        .find({ isDeleted: false, userId: { $in: userIds } })
        .toArray();

      const membersProcessing = mongoUsers.map((mongoUser) =>
        limit(async () => {
          const isAdmin = mongoUser.profile.role === 'admin';
          const isStaff = mongoUser.profile.role === 'staff';

          let email: string;

          const name = Name.create({
            firstName: mongoUser.profile.firstName as string,
            lastName: mongoUser.profile.lastName as string,
          });

          if (name.isErr()) {
            throw name.error;
          }

          if (mongoUser.emails && mongoUser.emails.length > 0) {
            email = mongoUser.emails[0].address;
          } else {
            const normalize = (str: string): string =>
              str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ñ/g, 'n')
                .replace(/Ñ/g, 'n')
                .replace(/\s+/g, '')
                .replace(/[''´`]/g, '')
                .toLowerCase();

            email = `${normalize(name.value.firstName)}.${normalize(name.value.lastName)}@clubsocialmontegrande.ar`;
          }

          if (isAdmin || isStaff) {
            const userId = UniqueId.generate().value;
            const fullName = `${name.value.firstName} ${name.value.lastName}`;

            await this.prismaService.user.create({
              data: {
                createdAt: (mongoUser.createdAt as Date) ?? new Date(),
                createdBy: 'System',
                email,
                firstName: name.value.firstName,
                id: userId,
                lastName: name.value.lastName,
                name: fullName,
                preferences: DEFAULT_USER_PREFERENCES,
                role: mongoUser.profile.role as UserRole,
                status: UserStatus.ACTIVE,
                updatedAt: (mongoUser.updatedAt as Date) ?? new Date(),
                updatedBy: 'System',
              },
            });

            return;
          }

          const mongoMember = mongoMembers.find(
            (mongoMember) => mongoMember.userId === mongoUser._id,
          );

          if (!mongoMember) {
            this.logger.warn({
              message: 'Member not found',
              params: { userId: mongoUser._id },
            });

            return;
          }

          const member = await this.createMember({
            email,
            mongoMember,
            name: name.value,
          });

          const memberId = member.id;
          membersMap.set(mongoMember._id.toString(), memberId);

          if (mongoMember.status === 'inactive') {
            await this.prismaService.member.update({
              data: { status: MemberStatus.INACTIVE },
              where: { id: memberId },
            });
          }
        }),
      );
      await Promise.all(membersProcessing);

      this.logger.info({
        message: `Processed ${usersSkip + mongoUsers.length} users`,
      });
      usersSkip += BATCH_SIZE;
    }

    // Process dues in batches
    this.logger.info({ message: 'Starting dues migration...' });
    let duesSkip = 0;

    while (true) {
      const mongoDues = await this.mongoConnection
        .collection('dues')
        .find({ isDeleted: false })
        .skip(duesSkip)
        .limit(BATCH_SIZE)
        .toArray();

      if (mongoDues.length === 0) break;

      const duesProcessing = mongoDues.map((mongoDue) =>
        limit(() => {
          const dueId = UniqueId.generate().value;
          duesMap.set(mongoDue._id.toString(), dueId);

          const memberId = membersMap.get(mongoDue.memberId);
          Guard.defined(memberId);

          return this.createDue({ dueId, memberId, mongoDue });
        }),
      );
      await Promise.all(duesProcessing);

      this.logger.info({
        message: `Processed ${duesSkip + mongoDues.length} dues`,
      });
      duesSkip += BATCH_SIZE;
    }

    // Process payments in batches
    this.logger.info({ message: 'Starting payments migration...' });
    let paymentsSkip = 0;

    while (true) {
      const mongoPayments = await this.mongoConnection
        .collection('payments')
        .find({ isDeleted: false })
        .skip(paymentsSkip)
        .limit(BATCH_SIZE)
        .toArray();

      if (mongoPayments.length === 0) break;

      const paymentsProcessing = mongoPayments.map((mongoPayment) =>
        limit(async () => {
          const paymentId = UniqueId.generate().value;
          paymentsMap.set(mongoPayment._id.toString(), paymentId);

          const memberId = membersMap.get(mongoPayment.memberId);
          Guard.defined(memberId);

          await this.createPayment({ memberId, mongoPayment, paymentId });

          const date = DateOnly.fromString(
            mongoPayment.date.toISOString().split('T')[0],
          );

          if (date.isErr()) {
            throw date.error;
          }

          if (mongoPayment.dues.length > 0) {
            const creditLedgerEntryId = UniqueId.generate().value;

            await this.createCreditLedgerEntry({
              creditLedgerEntryId,
              date: date.value.toString(),
              memberId,
              mongoPayment,
              paymentId,
            });

            const movementId = UniqueId.generate().value;
            movementsMap.set(mongoPayment._id.toString(), movementId);

            await this.createMovementForPayment({
              date: date.value.toString(),
              mongoPayment,
              movementId,
              paymentId,
            });
          }

          await Promise.all(
            mongoPayment.dues.map(async (mongoDuePayment: any) => {
              const debitLedgerEntryId = UniqueId.generate().value;
              await this.createDebitLedgerEntry({
                date: date.value.toString(),
                debitLedgerEntryId,
                memberId,
                mongoDuePayment,
                mongoPayment,
                paymentId,
              });

              const dueSettlementId = UniqueId.generate().value;
              const dueId = duesMap.get(mongoDuePayment.dueId);
              Guard.defined(dueId);

              await this.createDueSettlement({
                debitLedgerEntryId,
                dueId,
                dueSettlementId,
                mongoDuePayment,
                paymentId,
              });

              if (mongoPayment.status === 'voided') {
                await this.voidDueSettlement({
                  debitLedgerEntryId,
                  updatedAt: mongoPayment.voidedAt as Date,
                  updatedBy: mongoPayment.voidedBy as string,
                });
              }
            }),
          );
        }),
      );
      await Promise.all(paymentsProcessing);

      this.logger.info({
        message: `Processed ${paymentsSkip + mongoPayments.length} payments`,
      });
      paymentsSkip += BATCH_SIZE;
    }

    // Process movements in batches
    this.logger.info({ message: 'Starting movements migration...' });
    let movementsSkip = 0;

    while (true) {
      const mongoMovements = await this.mongoConnection
        .collection('movements')
        .find({
          category: { $ne: 'member-payment' },
          isDeleted: false,
        })
        .skip(movementsSkip)
        .limit(BATCH_SIZE)
        .toArray();

      if (mongoMovements.length === 0) break;

      const movementProcessing = mongoMovements.map((mongoMovement) =>
        limit(async () => {
          const movementId = UniqueId.generate().value;
          const isInflow = mongoMovement.type === 'income';

          const date = DateOnly.fromString(
            mongoMovement.date.toISOString().split('T')[0],
          );

          if (date.isErr()) {
            throw date.error;
          }

          return this.prismaService.movement.create({
            data: {
              amount: isInflow
                ? mongoMovement.amount
                : -(mongoMovement.amount as number),
              category:
                mongoMovementsCategoryMap[
                  mongoMovement.category as keyof typeof mongoMovementsCategoryMap
                ],
              createdAt: mongoMovement.createdAt as Date,
              createdBy: mongoMovement.createdBy as string,
              date: date.value.toString(),
              id: movementId,
              mode: MovementMode.MANUAL,
              notes: mongoMovement.notes || null,
              status: mongoMovement.status as MovementStatus,
              updatedAt: mongoMovement.updatedAt as Date,
              updatedBy: mongoMovement.updatedBy as string,
              voidedAt: mongoMovement.voidedAt as Date,
              voidedBy: mongoMovement.voidedBy as string,
              voidReason: mongoMovement.voidReason as string,
            },
          });
        }),
      );
      await Promise.all(movementProcessing);

      this.logger.info({
        message: `Processed ${movementsSkip + mongoMovements.length} movements`,
      });
      movementsSkip += BATCH_SIZE;
    }

    // Process events in batches
    this.logger.info({ message: 'Starting events migration...' });
    await this.prismaService.auditLog.deleteMany({});
    let eventsSkip = 0;

    while (true) {
      const mongoEvents = await this.mongoConnection
        .collection('events')
        .find({
          isDeleted: false,
          resource: { $ne: 'prices' },
        })
        .skip(eventsSkip)
        .limit(BATCH_SIZE)
        .toArray();

      if (mongoEvents.length === 0) break;

      const eventsProcessing = mongoEvents.map((mongoEvent) =>
        limit(async () => {
          const eventId = UniqueId.generate().value;

          const entityId = eventEntitiesMap[
            mongoEvent.resource as keyof typeof eventEntitiesMap
          ].get(mongoEvent.resourceId);

          if (!entityId) {
            this.logger.warn({
              message: 'Entity not found',
              params: { eventId: mongoEvent._id },
            });

            return;
          }

          await this.prismaService.auditLog.create({
            data: {
              action:
                eventActionMap[
                  mongoEvent.action as keyof typeof eventActionMap
                ],
              createdAt: mongoEvent.createdAt as Date,
              createdBy: mongoEvent.createdBy as string,
              entity:
                eventEntityMap[
                  mongoEvent.resource as keyof typeof eventEntityMap
                ],
              entityId,
              id: eventId,
              message: 'Evento migrado',
            },
          });
        }),
      );
      await Promise.all(eventsProcessing);

      this.logger.info({
        message: `Processed ${eventsSkip + mongoEvents.length} events`,
      });
      eventsSkip += BATCH_SIZE;
    }

    this.logger.info({ message: 'Migration completed' });
  }

  public async seed(): Promise<void> {
    const { total } = await this.userRepository.findPaginated({
      filters: {},
      page: 1,
      pageSize: 1,
      sort: [],
    });

    if (total > 0) {
      return;
    }

    await Promise.all([
      this.createUserUseCase.execute({
        createdBy: 'System',
        email: 'info@clubsocialmontegrande.ar',
        firstName: 'Admin',
        lastName: 'Club Social',
        role: UserRole.ADMIN,
      }),
      this.createUserUseCase.execute({
        createdBy: 'System',
        email: 'staff@clubsocialmontegrande.ar',
        firstName: 'Staff',
        lastName: 'Club Social',
        role: UserRole.STAFF,
      }),
    ]);

    return;

    const limit = pLimit(10);

    await Promise.all(
      times(135, () =>
        limit(() =>
          this.createMemberUseCase.execute({
            address: sample([
              null,
              Address.raw({
                cityName: sample([null, faker.location.city()]),
                stateName: sample([null, faker.location.state()]),
                street: sample([null, faker.location.street()]),
                zipCode: sample([null, faker.location.zipCode()]),
              }),
            ]),
            birthDate: sample([
              null,
              faker.date.birthdate().toISOString().split('T')[0],
            ]),
            category: sample([
              MemberCategory.MEMBER,
              MemberCategory.ADHERENT_MEMBER,
              MemberCategory.CADET,
              MemberCategory.PRE_CADET,
            ]),
            createdBy: 'System',
            documentID: sample([null, faker.string.uuid()]),
            email: faker.internet.email(),
            fileStatus: sample([FileStatus.COMPLETED, FileStatus.PENDING]),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            maritalStatus: sample([
              null,
              MaritalStatus.SINGLE,
              MaritalStatus.MARRIED,
              MaritalStatus.DIVORCED,
              MaritalStatus.WIDOWED,
            ]),
            nationality: sample([
              null,
              MemberNationality.ARGENTINA,
              MemberNationality.BULGARIA,
              MemberNationality.COLOMBIA,
              MemberNationality.UKRAINE,
            ]),
            phones: sample([
              [],
              [faker.phone.number()],
              [faker.phone.number(), faker.phone.number()],
            ]),
            sex: sample([null, MemberSex.MALE, MemberSex.FEMALE]),
          }),
        ),
      ),
    );
  }

  private async createCreditLedgerEntry({
    creditLedgerEntryId,
    date,
    memberId,
    mongoPayment,
    paymentId,
  }: {
    creditLedgerEntryId: string;
    date: string;
    memberId: string;
    mongoPayment: any;
    paymentId: string;
  }) {
    await this.prismaService.memberLedgerEntry.create({
      data: {
        amount: mongoPayment.amount as number,
        createdAt: mongoPayment.createdAt as Date,
        createdBy: mongoPayment.createdBy as string,
        date,
        id: creditLedgerEntryId,
        memberId,
        notes: null,
        paymentId,
        reversalOfId: null,
        source: MemberLedgerEntrySource.PAYMENT,
        status: MemberLedgerEntryStatus.POSTED,
        type: MemberLedgerEntryType.DEPOSIT_CREDIT,
        updatedAt: mongoPayment.updatedAt as Date,
        updatedBy: mongoPayment.updatedBy as string,
      },
    });
  }

  private async createDebitLedgerEntry({
    date,
    debitLedgerEntryId,
    memberId,
    mongoDuePayment,
    mongoPayment,
    paymentId,
  }: {
    date: string;
    debitLedgerEntryId: string;
    memberId: string;
    mongoDuePayment: any;
    mongoPayment: any;
    paymentId: string;
  }) {
    await this.prismaService.memberLedgerEntry.create({
      data: {
        amount: -(mongoDuePayment.directAmount as number),
        createdAt: DateFormat.parse(mongoPayment.createdAt as string)
          .add(1, 'second')
          .toDate(),
        createdBy: mongoPayment.createdBy as string,
        date,
        id: debitLedgerEntryId,
        member: { connect: { id: memberId } },
        notes: null,
        payment: { connect: { id: paymentId } },
        source: MemberLedgerEntrySource.PAYMENT,
        status: MemberLedgerEntryStatus.POSTED,
        type: MemberLedgerEntryType.DUE_APPLY_DEBIT,
        updatedAt: mongoPayment.updatedAt as Date,
        updatedBy: mongoPayment.updatedBy as string,
      },
    });
  }

  private async createDue({
    dueId,
    memberId,
    mongoDue,
  }: {
    dueId: string;
    memberId: string;
    mongoDue: any;
  }) {
    const date = DateOnly.fromString(mongoDue.date.toISOString().split('T')[0]);

    if (date.isErr()) {
      throw date.error;
    }

    await this.prismaService.due.create({
      data: {
        amount: mongoDue.amount as number,
        category: mongoDue.category as DueCategory,
        createdAt: mongoDue.createdAt as Date,
        createdBy: mongoDue.createdBy as string,
        date: date.value.toString(),
        id: dueId,
        member: { connect: { id: memberId } },
        notes: mongoDue.notes || null,
        status: mongoDue.status as DueStatus,
        updatedAt: mongoDue.updatedAt as Date,
        updatedBy: mongoDue.updatedBy || null,
        voidedAt: mongoDue.voidedAt || null,
        voidedBy: mongoDue.voidedBy || null,
        voidReason: mongoDue.voidReason || null,
      },
    });
  }

  private async createDueSettlement({
    debitLedgerEntryId,
    dueId,
    dueSettlementId,
    mongoDuePayment,
    paymentId,
  }: {
    debitLedgerEntryId: string;
    dueId: string;
    dueSettlementId: string;
    mongoDuePayment: any;
    paymentId: string;
  }) {
    await this.prismaService.dueSettlement.create({
      data: {
        amount: mongoDuePayment.directAmount as number,
        due: { connect: { id: dueId } },
        id: dueSettlementId,
        memberLedgerEntry: { connect: { id: debitLedgerEntryId } },
        payment: { connect: { id: paymentId } },
        status: DueSettlementStatus.APPLIED,
      },
    });
  }

  private async createMember({
    email,
    mongoMember,
    name,
  }: {
    email: string;
    mongoMember: any;
    name: Name;
  }): Promise<{ id: string }> {
    const birthDate = mongoMember.birthDate
      ? mongoMember.birthDate.toISOString().split('T')[0]
      : null;

    const userId = UniqueId.generate().value;
    const memberId = UniqueId.generate().value;
    const fullName = `${name.firstName} ${name.lastName}`;

    // Create user directly via Prisma (bypasses logging and events)
    await this.prismaService.user.create({
      data: {
        createdAt: (mongoMember.createdAt as Date) ?? new Date(),
        createdBy: (mongoMember.createdBy as string) ?? 'System',
        email,
        firstName: name.firstName,
        id: userId,
        lastName: name.lastName,
        name: fullName,
        role: UserRole.MEMBER,
        status: UserStatus.ACTIVE,
        updatedAt: (mongoMember.updatedAt as Date) ?? new Date(),
        updatedBy: (mongoMember.updatedBy as string) ?? 'System',
      },
    });

    // Create member directly via Prisma (bypasses logging and events)
    await this.prismaService.member.create({
      data: {
        birthDate,
        category: mongoMember.category as MemberCategory,
        cityName: mongoMember.address?.cityName ?? null,
        createdAt: (mongoMember.createdAt as Date) ?? new Date(),
        createdBy: (mongoMember.createdBy as string) ?? 'System',
        documentID: mongoMember.documentID || null,
        fileStatus: mongoMember.fileStatus || FileStatus.PENDING,
        id: memberId,
        maritalStatus: mongoMember.maritalStatus || null,
        nationality: mongoMember.nationality || null,
        phones: mongoMember.phones || [],
        sex: mongoMember.sex || null,
        stateName: mongoMember.address?.stateName ?? null,
        status: MemberStatus.ACTIVE,
        street: mongoMember.address?.street ?? null,
        updatedAt: (mongoMember.updatedAt as Date) ?? new Date(),
        updatedBy: mongoMember.updatedBy || null,
        userId,
        zipCode: mongoMember.address?.zipCode ?? null,
      },
    });

    return { id: memberId };
  }

  private async createMovementForPayment({
    date,
    mongoPayment,
    movementId,
    paymentId,
  }: {
    date: string;
    mongoPayment: any;
    movementId: string;
    paymentId: string;
  }) {
    await this.prismaService.movement.create({
      data: {
        amount: mongoPayment.amount as number,
        category: MovementCategory.MEMBER_LEDGER,
        createdAt: mongoPayment.createdAt as Date,
        createdBy: mongoPayment.createdBy as string,
        date: date.toString(),
        id: movementId,
        mode: MovementMode.AUTOMATIC,
        notes: 'Pago de deuda',
        payment: { connect: { id: paymentId } },
        status: MovementStatus.REGISTERED,
        updatedAt: mongoPayment.updatedAt as Date,
        updatedBy: mongoPayment.updatedBy as string,
        voidedAt: null,
        voidedBy: null,
        voidReason: null,
      },
    });
  }

  private async createPayment({
    memberId,
    mongoPayment,
    paymentId,
  }: {
    memberId: string;
    mongoPayment: any;
    paymentId: string;
  }) {
    const date = DateOnly.fromString(
      mongoPayment.date.toISOString().split('T')[0],
    );

    if (date.isErr()) {
      throw date.error;
    }

    return this.prismaService.payment.create({
      data: {
        amount: mongoPayment.amount as number,
        createdAt: mongoPayment.createdAt as Date,
        createdBy: mongoPayment.createdBy as string,
        date: date.value.toString(),
        id: paymentId,
        member: { connect: { id: memberId } },
        notes: mongoPayment.notes || null,
        receiptNumber: mongoPayment.receiptNumber?.toString() || null,
        status: mongoPayment.status as PaymentStatus,
        updatedAt: mongoPayment.updatedAt as Date,
        updatedBy: mongoPayment.updatedBy || null,
        voidedAt: mongoPayment.voidedAt || null,
        voidedBy: mongoPayment.voidedBy || null,
        voidReason: mongoPayment.voidReason || null,
      },
    });
  }

  private async voidDueSettlement({
    debitLedgerEntryId,
    updatedAt,
    updatedBy,
  }: {
    debitLedgerEntryId: string;
    updatedAt: Date;
    updatedBy: string;
  }) {
    const debitLedgerEntry =
      await this.prismaService.memberLedgerEntry.findUniqueOrThrow({
        where: { id: debitLedgerEntryId },
      });

    await this.prismaService.dueSettlement.update({
      data: {
        status: DueSettlementStatus.VOIDED,
      },
      where: {
        memberLedgerEntryId: debitLedgerEntryId,
      },
    });

    await this.prismaService.memberLedgerEntry.update({
      data: {
        status: MemberLedgerEntryStatus.REVERSED,
        updatedAt: DateFormat.parse(updatedAt.toISOString())
          .add(1, 'second')
          .toDate(),
        updatedBy,
      },
      where: { id: debitLedgerEntryId },
    });

    await this.prismaService.memberLedgerEntry.create({
      data: {
        amount: Math.abs(debitLedgerEntry.amount),
        createdAt: DateFormat.parse(updatedAt.toISOString())
          .add(2, 'seconds')
          .toDate(),
        createdBy: updatedBy,
        date: updatedAt.toISOString().split('T')[0],
        id: UniqueId.generate().value,
        memberId: debitLedgerEntry.memberId,
        notes: null,
        paymentId: debitLedgerEntry.paymentId,
        reversalOfId: debitLedgerEntryId,
        source: MemberLedgerEntrySource.PAYMENT,
        status: MemberLedgerEntryStatus.POSTED,
        type: MemberLedgerEntryType.REVERSAL_CREDIT,
        updatedAt: DateFormat.parse(updatedAt.toISOString())
          .add(2, 'second')
          .toDate(),
        updatedBy,
      },
    });

    await this.prismaService.memberLedgerEntry.create({
      data: {
        amount: debitLedgerEntry.amount,
        createdAt: DateFormat.parse(updatedAt.toISOString())
          .add(3, 'seconds')
          .toDate(),
        createdBy: updatedBy,
        date: updatedAt.toISOString().split('T')[0],
        id: UniqueId.generate().value,
        memberId: debitLedgerEntry.memberId,
        notes: 'Ajuste por migración',
        paymentId: debitLedgerEntry.paymentId,
        reversalOfId: debitLedgerEntryId,
        source: MemberLedgerEntrySource.ADJUSTMENT,
        status: MemberLedgerEntryStatus.POSTED,
        type: MemberLedgerEntryType.ADJUSTMENT_DEBIT,
        updatedAt: DateFormat.parse(updatedAt.toISOString())
          .add(3, 'seconds')
          .toDate(),
        updatedBy,
      },
    });
  }
}
