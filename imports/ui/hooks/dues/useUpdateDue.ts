import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { UpdateDueRequestDto } from '@adapters/dtos/update-due-request.dto';
import { DueDto } from '@application/dues/dtos/due.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdateDue = () =>
  useMutation<UpdateDueRequestDto, DueDto>({
    methodName: MeteorMethodEnum.DuesUpdate,
  });
