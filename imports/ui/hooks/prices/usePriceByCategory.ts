import { PriceDto } from '@application/prices/dtos/price.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetPriceRequestDto } from '@ui/dtos/get-price-request.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePriceByCategory = (request?: GetPriceRequestDto) =>
  useQuery<GetPriceRequestDto, PriceDto | null>({
    methodName: MeteorMethodEnum.PricesGetOneByCategory,
    request,
  });
