import { IModel } from '@domain/common/models/model.interface';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';

export interface IEvent extends IModel {
  action: EventActionEnum;
  description: string | null;
  resource: EventResourceEnum;
  resourceId: string;
}

export interface CreateEvent {
  action: EventActionEnum;
  description: string | null;
  resource: EventResourceEnum;
  resourceId: string;
}
