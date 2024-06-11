import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateDueRequestDto } from '@adapters/dtos/create-due-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateDue = () =>
  useMutation<CreateDueRequestDto, null>({
    methodName: MeteorMethodEnum.DuesCreate,
  });
