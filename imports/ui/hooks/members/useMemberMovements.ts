import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { GetMemberMovementsGridRequestDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.request.dto';
import { GetMemberMovementsGridResponseDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.response.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { useQuery } from '@tanstack/react-query';

export const useMemberMovementsGrid = (
  request: GetMemberMovementsGridRequestDto
) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request));
  }, [request]);

  return useQuery<
    GetMemberMovementsGridRequestDto,
    Error,
    GetMemberMovementsGridResponseDto
  >([MethodsEnum.MovementsGetGrid, request], () =>
    Meteor.callAsync(MethodsEnum.MembersGetMovementsGrid, request)
  );
};
