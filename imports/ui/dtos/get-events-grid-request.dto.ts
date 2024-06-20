import { IsArray, IsEnum, IsString } from 'class-validator';

import { FindPaginatedEventsRequest } from '@application/events/repositories/event.repository';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';

export class GetEventsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedEventsRequest
{
  @IsEnum(EventActionEnum, { each: true })
  @IsArray()
  public filterByAction!: EventActionEnum[];

  @IsString({ each: true })
  @IsArray()
  public filterByCreatedAt!: string[];

  @IsEnum(EventResourceEnum, { each: true })
  @IsArray()
  public filterByResource!: EventResourceEnum[];
}
