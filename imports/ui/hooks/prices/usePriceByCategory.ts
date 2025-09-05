import { PriceDto } from '@application/prices/dtos/price.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetPriceByDueCategoryRequestDto } from '@ui/dtos/get-price-by-due-category-request.dto';
import { useQuery } from '@ui/hooks/query/useQuery';

export const usePriceByCategory = (request?: GetPriceByDueCategoryRequestDto) =>
  useQuery<GetPriceByDueCategoryRequestDto, PriceDto | null>({
    methodName: MeteorMethodEnum.PricesGetOneByCategory,
    request,
  });
