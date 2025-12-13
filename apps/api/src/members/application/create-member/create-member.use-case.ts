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
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok } from '@/shared/domain/result';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

import type { CreateMemberParams } from './create-member.params';

export class CreateMemberUseCase extends UseCase<MemberEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
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

    const email = Email.create(params.email);

    if (email.isErr()) {
      return err(email.error);
    }

    const member = MemberEntity.create({
      banExpires: null,
      banned: false,
      banReason: null,
      createdBy: params.createdBy,
      email: email.value,
      firstName: params.firstName,
      lastName: params.lastName,
      role: params.role,
      status: UserStatus.ACTIVE,
    });

    if (member.isErr()) {
      return err(member.error);
    }

    this.eventPublisher.dispatch(member.value);

    return ok(member.value);
  }
}
