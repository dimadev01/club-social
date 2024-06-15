import { DueDto } from '@application/dues/dtos/due.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useDue = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, DueDto>({
    methodName: MeteorMethodEnum.DuesGetOne,
    request,
  });
