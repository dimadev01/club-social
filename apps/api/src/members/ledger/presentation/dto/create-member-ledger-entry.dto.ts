import {
  CreateMemberLedgerEntryDto,
  MemberLedgerEntryMovementType,
} from '@club-social/shared/members';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMemberLedgerEntryRequestDto implements CreateMemberLedgerEntryDto {
  @IsInt()
  @IsNotEmpty()
  public amount: number;

  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsNotEmpty()
  @IsUUID()
  public memberId: string;

  @IsEnum(MemberLedgerEntryMovementType)
  @IsNotEmpty()
  public movementType: MemberLedgerEntryMovementType;

  @IsOptional()
  @IsString()
  public notes: null | string;
}
