import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { Due } from '@domain/dues/models/due.model';

export type GetDuesGridResponse<T = Due> = FindPaginatedResponse<T>;
