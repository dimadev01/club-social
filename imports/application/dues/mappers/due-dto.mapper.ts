import { injectable } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { DueDto } from '@application/dues/dtos/due.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { Due } from '@domain/dues/models/due.model';

@injectable()
export class DueDtoMapper extends MapperDto<Due, DueDto> {
  public constructor(private readonly _memberDtoMapper: MemberDtoMapper) {
    super();
  }

  public toDto(due: Due): DueDto {
    return {
      amount: due.amount.value,
      category: due.category,
      date: due.date.toISOString(),
      id: due._id,
      member: due.member ? this._memberDtoMapper.toDto(due.member) : undefined,
      memberId: due.memberId,
      notes: due.notes,
      pendingAmount: due.getPendingAmount().value,
      status: due.status,
    };
  }
}
