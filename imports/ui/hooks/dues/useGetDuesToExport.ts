import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid-request.dto';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useGetDuesToExport = () =>
  useMutation<GetDuesGridRequestDto, DueGridDto[]>({
    methodName: MeteorMethodEnum.DuesGetToExport,
  });
