import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetDuesGridRequestDto } from '@ui/dtos/get-dues-grid-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useGetDuesToExport = () =>
  useMutation<GetDuesGridRequestDto, DueGridDto[]>({
    methodName: MeteorMethodEnum.DuesGetToExport,
  });
