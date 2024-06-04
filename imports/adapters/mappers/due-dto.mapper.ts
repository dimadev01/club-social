import { singleton } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { MemberDtoMapper } from '@adapters/mappers/member-dto.mapper';
import { DueDto } from '@application/dues/dtos/due.dto';
import { Due } from '@domain/dues/models/due.model';

@singleton()
export class DueDtoMapper extends MapperDto<Due, DueDto> {
  public constructor(private readonly _memberDtoMapper: MemberDtoMapper) {
    super();
  }

  public toDto(domain: Due): DueDto {
    return {
      amount: domain.amount.amount,
      category: domain.category,
      date: domain.date.toISOString(),
      id: domain._id,
      member: domain.member
        ? this._memberDtoMapper.toDto(domain.member)
        : undefined,
      memberId: domain.memberId,
      notes: domain.notes,
      status: domain.status,
    };
  }
}
