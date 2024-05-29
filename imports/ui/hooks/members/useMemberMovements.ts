import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { GetMemberMovementsGridRequestDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.request.dto';
import { GetMemberMovementsGridResponseDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.response.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';

export const useMemberMovementsGrid = (
  request: GetMemberMovementsGridRequestDto,
) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<
    GetMemberMovementsGridRequestDto,
    Error,
    GetMemberMovementsGridResponseDto
  >([MeteorMethodEnum.MovementsGetGrid, request], () =>
    Meteor.callAsync(MeteorMethodEnum.MembersGetMovementsGrid, request),
  );
};
