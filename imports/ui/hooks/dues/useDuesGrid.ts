import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridResponseDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';

export const useDuesGrid = (request: GetDuesGridRequestDto) =>
  useQueryGrid<GetDuesGridRequestDto, GetDuesGridResponseDto>(
    MethodsEnum.DuesGetGrid,
    request,
  );
