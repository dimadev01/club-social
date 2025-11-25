import {
  PaginatedRequestParams,
  PaginatedResponse,
} from '@/domain/shared/types';
import { UserEntity } from '@/domain/users/user.entity';

export class PrismaUsersRepository {
  public findPaginated(
    params: PaginatedRequestParams,
  ): Promise<PaginatedResponse<UserEntity>> {
    return Promise.resolve({
      data: [],
      meta: {
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
        totalPages: 0,
      },
    });
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    return Promise.resolve(entity);
  }
}
