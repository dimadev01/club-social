import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateDueRequestDto } from '@ui/dtos/create-due-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateDue = () =>
  useMutation<CreateDueRequestDto, null>({
    methodName: MeteorMethodEnum.DuesCreate,
  });
