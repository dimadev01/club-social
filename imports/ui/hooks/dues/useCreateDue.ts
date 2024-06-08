import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateDueRequest } from '@application/dues/use-cases/create-due/create-due.request';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useCreateDue = () =>
  useMutation<CreateDueRequest, null>({
    methodName: MeteorMethodEnum.DuesCreate,
  });
