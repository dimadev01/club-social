import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridResponseDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.response.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@tanstack/react-query';

export const useDuesGrid = (request: GetDuesGridRequestDto) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request));
  }, [request]);

  return useQuery<GetDuesGridRequestDto, Error, GetDuesGridResponseDto>(
    [MethodsEnum.DuesGetGrid, request],
    () => Meteor.callAsync(MethodsEnum.DuesGetGrid, request)
  );
};
