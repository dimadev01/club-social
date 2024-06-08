import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';

export type GetMembersGridResponse = FindPaginatedResponse<MemberGridDto>;
