import { DeleteDueRequest } from '@application/dues/use-cases/delete-due/delete-due.request';
import { DeleteDueResponse } from '@application/dues/use-cases/delete-due/delete-due.response';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useDeleteDue = () =>
  useMutation<DeleteDueRequest, DeleteDueResponse>({
    methodName: MeteorMethodEnum.DuesDelete,
  });
