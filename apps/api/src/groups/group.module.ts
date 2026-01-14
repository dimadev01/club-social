import { Module } from '@nestjs/common';

import { CreateGroupUseCase } from './application/create-group.use-case';
import { GroupController } from './presentation/group.controller';

@Module({
  controllers: [GroupController],
  exports: [],
  imports: [],
  providers: [CreateGroupUseCase],
})
export class GroupModule {}
