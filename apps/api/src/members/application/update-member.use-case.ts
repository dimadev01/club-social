import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberNotificationPreferencesDto,
  MemberSex,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';
import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { MemberEntity } from '@/members/domain/entities/member.entity';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
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
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

interface UpdateMemberParams {
  address: Address | null;
  birthDate: null | string;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  id: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  notificationPreferences: MemberNotificationPreferencesDto;
  phones: string[];
  sex: MemberSex | null;
  status: UserStatus;
  updatedBy: string;
}

export class UpdateMemberUseCase extends UseCase<MemberEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: UpdateMemberParams,
  ): Promise<Result<MemberEntity>> {
    this.logger.info({
      message: 'Updating member',
      params,
    });

    const results = ResultUtils.combine([
      Email.create(params.email),
      params.birthDate ? DateOnly.fromString(params.birthDate) : ok(),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [email, birthDate] = results.value;

    const existingUserByEmail =
      await this.userRepository.findUniqueByEmail(email);

    const member = await this.memberRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    if (existingUserByEmail && !existingUserByEmail.id.equals(member.userId)) {
      return err(new ConflictError('El email ya está en uso'));
    }

    const user = await this.userRepository.findByIdOrThrow(member.userId);

    const name = Name.create({
      firstName: params.firstName,
      lastName: params.lastName,
    });

    if (name.isErr()) {
      return err(name.error);
    }

    user.updateProfile({
      email,
      name: name.value,
      status: params.status,
      updatedBy: params.updatedBy,
    });

    user.updateNotificationPreferences(
      {
        notifyOnDueCreated: params.notificationPreferences.notifyOnDueCreated,
        notifyOnPaymentMade: params.notificationPreferences.notifyOnPaymentMade,
      },
      params.updatedBy,
    );

    member.updateProfile({
      address: params.address,
      birthDate: birthDate ?? null,
      category: params.category,
      documentID: params.documentID,
      fileStatus: params.fileStatus,
      maritalStatus: params.maritalStatus,
      nationality: params.nationality,
      phones: params.phones,
      sex: params.sex,
      status: params.status,
      updatedBy: params.updatedBy,
    });

    await this.unitOfWork.execute(
      async ({ memberRepository, userRepository }) => {
        await userRepository.save(user);
        await memberRepository.save(member);
      },
    );

    this.eventPublisher.dispatch(user);
    this.eventPublisher.dispatch(member);

    return ok(member);
  }
}
