import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';

export interface EventGridDto {
  action: EventActionEnum;
  createdAt: string;
  createdBy: string;
  description: string | null;
  id: string;
  resource: EventResourceEnum;
  resourceId: string;
}
