import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberNotificationPreferencesDto,
  MemberSex,
} from '@club-social/shared/members';
import { UserRole } from '@club-social/shared/users';
import { Inject, Injectable } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { MemberEntity } from '@/members/domain/entities/member.entity';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ConflictError } from '@/shared/domain/errors/conflict.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import { MemberNotification } from '../domain/value-objects/member-notification.vo';

interface CreateMemberParams {
  address: Address | null;
  birthDate: null | string;
  category: MemberCategory;
  createdBy: string;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  notificationPreferences: MemberNotificationPreferencesDto;
  phones: string[];
  sex: MemberSex | null;
}

@Injectable()
export class CreateMemberUseCase extends UseCase<MemberEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: CreateMemberParams,
  ): Promise<Result<MemberEntity>> {
    this.logger.info({
      message: 'Creating member',
      params,
    });

    const results = ResultUtils.combine([
      Email.create(params.email),
      params.birthDate ? DateOnly.fromString(params.birthDate) : ok(),
      Name.create({
        firstName: params.firstName,
        lastName: params.lastName,
      }),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [email, birthDate, name] = results.value;

    const existingUserByEmail =
      await this.userRepository.findUniqueByEmail(email);

    if (existingUserByEmail) {
      return err(new ConflictError('El email ya está en uso'));
    }

    const user = UserEntity.create(
      { email, name, role: UserRole.MEMBER },
      params.createdBy,
    );

    if (user.isErr()) {
      return err(user.error);
    }

    const member = MemberEntity.create(
      {
        address: params.address,
        birthDate: birthDate ?? null,
        category: params.category,
        documentID: params.documentID,
        fileStatus: params.fileStatus,
        maritalStatus: params.maritalStatus,
        nationality: params.nationality,
        notificationPreferences: MemberNotification.raw({
          notifyOnDueCreated: params.notificationPreferences.notifyOnDueCreated,
          notifyOnPaymentMade:
            params.notificationPreferences.notifyOnPaymentMade,
        }),
        phones: params.phones,
        sex: params.sex,
        userId: user.value.id,
      },
      user.value,
    );

    if (member.isErr()) {
      return err(member.error);
    }

    await this.unitOfWork.execute(
      async ({ memberRepository, userRepository }) => {
        await userRepository.save(user.value);
        await memberRepository.save(member.value);
      },
    );

    this.eventPublisher.dispatch(member.value);

    return ok(member.value);
  }
}
