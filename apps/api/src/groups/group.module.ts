import { Module } from '@nestjs/common';

import { CreateGroupUseCase } from './application/create-group.use-case';
import { DeleteGroupUseCase } from './application/delete-group.use-case';
import { UpdateGroupUseCase } from './application/update-group.use-case';
import { GroupController } from './presentation/group.controller';

@Module({
  controllers: [GroupController],

  providers: [CreateGroupUseCase, DeleteGroupUseCase, UpdateGroupUseCase],
})
export class GroupModule {}
