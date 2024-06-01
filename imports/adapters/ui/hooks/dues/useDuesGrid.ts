import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { useQueryGrid } from '@adapters/ui/hooks/useQueryGrid';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridResponseDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.response.dto';

export const useDuesGrid = (request: GetDuesGridRequestDto) =>
  useQueryGrid<GetDuesGridRequestDto, GetDuesGridResponseDto>({
    methodName: MeteorMethodEnum.DuesGetGrid,
    request,
  });
