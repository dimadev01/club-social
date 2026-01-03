import { DateRangeDto } from '@club-social/shared/types';

import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface FindPendingByMemberIdParams extends DateRangeDto {
  memberId?: UniqueId;
}
