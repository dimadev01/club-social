import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { GetMembersGridRequest } from '@application/members/use-cases/ger-members-grid/get-members-grid.request';
import { useMutation } from '@ui/hooks/query/useMutation';

export const useGetMembersToExport = () =>
  useMutation<GetMembersGridRequest, MemberGridDto[]>({
    methodName: MeteorMethodEnum.MembersGetToExport,
  });
