/* eslint-disable @typescript-eslint/no-explicit-any */
import { DueCategory, DueStatus } from '@club-social/shared/dues';
import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { PaymentStatus } from '@club-social/shared/payments';
import { UserRole } from '@club-social/shared/users';
import { faker } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { sample, times } from 'es-toolkit/compat';
import { Connection } from 'mongoose';
import pLimit from 'p-limit';

import { ConfigService } from './infrastructure/config/config.service';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { CreateMemberUseCase } from './members/application/create-member.use-case';
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

@Injectable()
export class AppService {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @InjectConnection()
    private readonly mongoConnection: Connection,
  ) {}

  public async clear(): Promise<void> {
    await this.prismaService.auditLog.deleteMany({});
    await this.prismaService.movement.deleteMany({});
    await this.prismaService.dueSettlement.deleteMany({});
    await this.prismaService.payment.deleteMany({});
    await this.prismaService.due.deleteMany({});
    await this.prismaService.pricing.deleteMany({});
    await this.prismaService.member.deleteMany({});
    await this.prismaService.memberLedgerEntry.deleteMany({});

    // await this.prismaService.session.deleteMany({});
    // await this.prismaService.account.deleteMany({});
    // await this.prismaService.verification.deleteMany({});
    // await this.prismaService.passkey.deleteMany({});
    await this.prismaService.user.deleteMany({
      where: {
        role: UserRole.MEMBER,
      },
    });
  }

  public getHello(): string {
    return 'Hello World!';
  }

  public async migrate() {
    await this.clear();

    const mongoUsers = await this.mongoConnection
      .collection('users')
      .find({
        // @ts-expect-error - _id is a string
        _id: 'DZL4CRjKvfv8yvsxR',
        isDeleted: false,
      })
      .limit(10)
      .toArray();

    for (const mongoUser of mongoUsers) {
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
        // Normalize letters (e.g., ñ → n) and remove spaces for email construction
        const normalize = (str: string): string =>
          str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
            .replace(/ñ/g, 'n') // Lowercase ñ specifically (edge case for some environments)
            .replace(/Ñ/g, 'n') // Uppercase Ñ
            .replace(/\s+/g, '') // Remove whitespace
            .replace(/[’'´`]/g, '') // Remove special apostrophe/acute characters like ’, ', ´, `
            .toLowerCase();

        email = `${normalize(name.value.firstName)}.${normalize(name.value.lastName)}@clubsocialmontegrande.ar`;
      }

      if (isAdmin || isStaff) {
        const result = await this.createUserUseCase.execute({
          createdBy: 'System',
          email,
          firstName: name.value.firstName,
          lastName: name.value.lastName,
          role: mongoUser.profile.role as UserRole,
        });

        if (result.isErr()) {
          throw result.error;
        }

        continue;
      }

      const mongoMember = await this.mongoConnection
        .collection('members')
        .findOne({ userId: mongoUser._id });

      if (!mongoMember) {
        this.logger.warn({
          message: 'Member not found',
          params: { userId: mongoUser._id },
        });

        continue;
      }

      const member = await this.createMember({
        email,
        mongoMember,
        name: name.value,
      });

      const memberId = member.id;

      const mongoDues = await this.mongoConnection
        .collection('dues')
        .find({
          memberId: mongoMember._id,
          status: {
            $ne: DueStatus.VOIDED,
          },
        })
        .toArray();

      for (const mongoDue of mongoDues) {
        const dueId = UniqueId.generate();
        await this.createDue({ dueId, memberId, mongoDue });

        for (const mongoDuePayment of mongoDue.payments) {
          const mongoPayment = await this.mongoConnection
            .collection('payments')
            .findOne({ _id: mongoDuePayment.paymentId });
          Guard.defined(mongoPayment);

          const paymentId = UniqueId.generate();
          const payment = await this.createPayment({
            memberId,
            mongoPayment,
            paymentId,
          });

          console.log(payment);

          /**
           * Each payment must create a corresponding member double ledger entry
           * Each `mongoDuePayment` is a DueSettlementDto
           * Each payment must create a corresponding movement
           */
        }
      }
    }
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
        email: this.configService.adminUserEmail,
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

  private async createDue({
    dueId,
    memberId,
    mongoDue,
  }: {
    dueId: UniqueId;
    memberId: UniqueId;
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
        id: dueId.value,
        member: { connect: { id: memberId.value } },
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

  private async createMember({
    email,
    mongoMember,
    name,
  }: {
    email: string;
    mongoMember: any;
    name: Name;
  }) {
    let address: Address | null = null;

    if (
      mongoMember.address &&
      (mongoMember.address.cityName ||
        mongoMember.address.stateName ||
        mongoMember.address.street ||
        mongoMember.address.zipCode)
    ) {
      const result = Address.create({
        cityName: mongoMember.address.cityName ?? null,
        stateName: mongoMember.address.stateName ?? null,
        street: mongoMember.address.street ?? null,
        zipCode: mongoMember.address.zipCode ?? null,
      });

      if (result.isErr()) {
        throw result.error;
      }

      address = result.value;
    }

    const birthDate = mongoMember.birthDate
      ? DateOnly.fromString(mongoMember.birthDate.toISOString().split('T')[0])
      : null;

    if (birthDate && birthDate.isErr()) {
      throw birthDate.error;
    }

    const result = await this.createMemberUseCase.execute({
      address,
      birthDate: birthDate ? birthDate.value.toString() : null,
      category: mongoMember.category as MemberCategory,
      createdBy: mongoMember.createdBy as string,
      documentID: mongoMember.documentID || null,
      email,
      fileStatus: mongoMember.fileStatus || FileStatus.PENDING,
      firstName: name.firstName,
      lastName: name.lastName,
      maritalStatus: mongoMember.maritalStatus || null,
      nationality: mongoMember.nationality || null,
      phones: mongoMember.phones || [],
      sex: mongoMember.sex || null,
    });

    if (result.isErr()) {
      throw result.error;
    }

    return result.value;
  }

  private async createPayment({
    memberId,
    mongoPayment,
    paymentId,
  }: {
    memberId: UniqueId;
    mongoPayment: any;
    paymentId: UniqueId;
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
        id: paymentId.value,
        member: { connect: { id: memberId.value } },
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
}
