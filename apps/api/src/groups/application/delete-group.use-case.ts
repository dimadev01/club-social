import { Inject, Injectable } from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ok, Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  GROUP_REPOSITORY_PROVIDER,
  type GroupRepository,
} from '../domain/group.repository';

interface DeleteGroupParams {
  deletedBy: string;
  id: string;
}

@Injectable()
export class DeleteGroupUseCase extends UseCase<void> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
  ) {
    super(logger);
  }

  public async execute(params: DeleteGroupParams): Promise<Result<void>> {
    this.logger.info({
      message: 'Deleting group',
      params,
    });

    const group = await this.groupRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    group.delete(params.deletedBy, new Date());

    await this.groupRepository.save(group);

    return ok();
  }
}
