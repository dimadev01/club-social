import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';

export type GetDuesGridResponse = FindPaginatedResponse<DueGridDto>;
