import { DueDto } from '@application/dues/dtos/due.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { UpdateDueRequestDto } from '@ui/dtos/update-due-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdateDue = () =>
  useMutation<UpdateDueRequestDto, DueDto>({
    methodName: MeteorMethodEnum.DuesUpdate,
  });
