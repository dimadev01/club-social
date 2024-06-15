import { VoidDueMethodRequestDto } from '@infra/meteor/dtos/void-due-method-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useVoidDue = () =>
  useMutation<VoidDueMethodRequestDto, null>({
    methodName: MeteorMethodEnum.DuesVoid,
  });
