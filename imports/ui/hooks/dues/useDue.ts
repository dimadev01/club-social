import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DueDto } from '@application/dues/dtos/due.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const useDue = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, DueDto>({
    methodName: MeteorMethodEnum.DuesGet,
    request,
  });
