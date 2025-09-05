import { PriceDto } from '@application/prices/dtos/price.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePrice = (request?: GetOneByIdRequestDto) =>
  useQuery<GetOneByIdRequestDto, PriceDto | null>({
    methodName: MeteorMethodEnum.PricesGetOne,
    request,
  });
