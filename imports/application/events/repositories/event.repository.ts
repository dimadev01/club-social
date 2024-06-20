import { ICrudRepository } from '@application/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  IGridRepository,
} from '@application/common/repositories/grid.repository';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { Event } from '@domain/events/models/event.model';

export interface FindPaginatedEventsFilters {
  filterByAction: EventActionEnum[];
  filterByCreatedAt: string[];
  filterByResource: EventResourceEnum[];
}

export interface FindPaginatedEventsRequest
  extends FindPaginatedEventsFilters,
    FindPaginatedRequest {}

export interface IEventRepository
  extends ICrudRepository<Event>,
    IGridRepository<Event, FindPaginatedEventsRequest> {}
