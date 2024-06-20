import { ColumnFilterItem } from 'antd/es/table/interface';

import {
  EventActionEnum,
  EventActionLabel,
  EventResourceEnum,
  EventResourceLabel,
} from '@domain/events/event.enum';

export abstract class EventsUIUtils {
  public static getResourceGridFilters(): ColumnFilterItem[] {
    return Object.values(EventResourceEnum)
      .sort((a, b) =>
        EventResourceLabel[a].localeCompare(EventResourceLabel[b]),
      )
      .map((status) => ({
        text: EventResourceLabel[status],
        value: status,
      }));
  }

  public static getActionsGridFilters(): ColumnFilterItem[] {
    return Object.values(EventActionEnum)
      .sort((a, b) => EventActionLabel[a].localeCompare(EventActionLabel[b]))
      .map((status) => ({
        text: EventActionLabel[status],
        value: status,
      }));
  }
}
