import { PriceDto } from '@application/prices/dtos/price.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { UpdatePriceRequestDto } from '@ui/dtos/update-price-request.dto';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useUpdatePrice = () =>
  useMutation<UpdatePriceRequestDto, PriceDto>({
    methodName: MeteorMethodEnum.PricesUpdate,
  });
