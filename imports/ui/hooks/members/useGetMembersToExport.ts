import { GetMembersGridRequestDto } from '@adapters/members/dtos/get-members-grid-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { MemberGridModelDto } from '@application/members/use-cases/get-members-grid/member-grid-model-dto';
import { useMutation } from '@ui/hooks/useMutation';

export const useMembersToExport = () =>
  useMutation<GetMembersGridRequestDto, MemberGridModelDto[]>({
    methodName: MeteorMethodEnum.MembersGetToExport,
  });
