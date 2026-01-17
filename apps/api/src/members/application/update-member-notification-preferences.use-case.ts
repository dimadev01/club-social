import { UpdateMemberNotificationPreferencesDto } from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';

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
import { ok } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface UpdateMemberNotificationPreferencesParams {
  memberId: string;
  notificationPreferences: UpdateMemberNotificationPreferencesDto;
  updatedBy: string;
}

@Injectable()
export class UpdateMemberNotificationPreferencesUseCase extends UseCase<MemberEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
  ) {
    super(logger);
  }

  public async execute(
    params: UpdateMemberNotificationPreferencesParams,
  ): Promise<Result<MemberEntity>> {
    this.logger.info({
      message: 'Updating member notification preferences',
      params,
    });

    const member = await this.memberRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.memberId }),
    );

    const updatedPreferences = member.notificationPreferences.update(
      params.notificationPreferences,
    );

    member.updateNotificationPreferences(updatedPreferences, params.updatedBy);

    await this.memberRepository.save(member);

    return ok(member);
  }
}
