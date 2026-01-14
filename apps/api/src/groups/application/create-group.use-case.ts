import { Inject, Injectable } from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, Result } from '@/shared/domain/result';

import { GroupEntity } from '../domain/entities/group.entity';
import {
  GROUP_REPOSITORY_PROVIDER,
  type GroupRepository,
} from '../domain/group.repository';

interface CreateGroupParams {
  createdBy: string;
  memberIds: string[];
  name: string;
}

@Injectable()
export class CreateGroupUseCase extends UseCase<GroupEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: CreateGroupParams,
  ): Promise<Result<GroupEntity>> {
    this.logger.info({
      message: 'Creating group',
      params,
    });

    const group = GroupEntity.create(
      { memberIds: params.memberIds, name: params.name },
      params.createdBy,
    );

    if (group.isErr()) {
      return err(group.error);
    }

    await this.groupRepository.save(group.value);
    this.eventPublisher.dispatch(group.value);

    return ok(group.value);
  }
}
