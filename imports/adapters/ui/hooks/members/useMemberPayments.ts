import { GetMemberPaymentsGridRequestDto } from '@application/members/use-cases/get-member-payments-grid/get-member-payments-grid.request.dto';
import { GetMemberPaymentsGridResponseDto } from '@application/members/use-cases/get-member-payments-grid/get-member-payments-grid.response.dto';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';

export const useMemberPaymentsGrid = (
  request: GetMemberPaymentsGridRequestDto,
) => {
  const [, setSearchParams] = useSearchParams();

  useDeepCompareEffect(() => {
    setSearchParams(UrlUtils.stringify(request), { replace: true });
  }, [request]);

  return useQuery<
    GetMemberPaymentsGridRequestDto,
    Error,
    GetMemberPaymentsGridResponseDto
  >([MeteorMethodEnum.MembersGetPaymentsGrid, request], () =>
    Meteor.callAsync(MeteorMethodEnum.MembersGetPaymentsGrid, request),
  );
};
