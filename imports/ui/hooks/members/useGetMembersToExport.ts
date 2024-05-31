import { MemberGridModelDto } from '@domain/members/use-cases/get-members-grid/member-grid-model-dto';
import { GetMembersGridRequestDto } from '@infra/controllers/member/get-members-grid-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { useMutation } from '@ui/hooks/useMutation';

export const useMembersToExport = () =>
  useMutation<GetMembersGridRequestDto, MemberGridModelDto[]>({
    methodName: MeteorMethodEnum.MembersGetToExport,
  });
