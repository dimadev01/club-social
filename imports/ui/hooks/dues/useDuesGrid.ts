import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { GetDuesGridResponseDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.response.dto';
import { useQueryGrid } from '../useQueryGrid';

export const useDuesGrid = (request: GetDuesGridRequestDto) =>
  useQueryGrid<GetDuesGridRequestDto, GetDuesGridResponseDto>(
    MethodsEnum.DuesGetGrid,
    request,
  );
