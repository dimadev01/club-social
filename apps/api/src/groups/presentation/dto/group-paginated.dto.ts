import {
  GroupPaginatedDto,
  GroupPaginatedMemberDto,
} from '@club-social/shared/groups';

export class GroupPaginatedMemberResponseDto implements GroupPaginatedMemberDto {
  public id: string;
  public name: string;
}

export class GroupPaginatedResponseDto implements GroupPaginatedDto {
  public discountPercentage: number;
  public id: string;
  public members: GroupPaginatedMemberResponseDto[];
  public name: string;
}
