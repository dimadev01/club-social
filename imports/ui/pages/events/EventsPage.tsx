import { Card, Space } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { EventGridDto } from '@application/events/dtos/event-grid.dto';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import {
  EventActionEnum,
  EventActionLabel,
  EventResourceEnum,
  EventResourceLabel,
} from '@domain/events/event.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { Button } from '@ui/components/Button/Button';
import { EventsUIUtils } from '@ui/components/Events/Events.utils';
import { Grid } from '@ui/components/Grid/Grid';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useGrid } from '@ui/components/Grid/useGrid';
import { EventsIcon } from '@ui/components/Icons/EventsIcon';
import { ViewIcon } from '@ui/components/Icons/ViewIcon';
import { GetEventsGridRequestDto } from '@ui/dtos/get-events-grid-request.dto';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { GridPeriodFilter } from '@ui/pages/payments/GridPeriodFilter';

export const EventsPage = () => {
  const navigate = useNavigate();

  const { gridState, onTableChange, clearFilters, resetFilters } =
    useGrid<EventGridDto>({
      defaultFilters: {
        action: [],
        createdAt: [],
        resource: [],
      },
      defaultSorter: { createdAt: 'descend' },
    });

  const gridRequest: GetEventsGridRequestDto = {
    filterByAction: gridState.filters.action as EventActionEnum[],
    filterByCreatedAt: gridState.filters.createdAt,
    filterByResource: gridState.filters.resource as EventResourceEnum[],
    limit: gridState.pageSize,
    page: gridState.page,
    sorter: gridState.sorter,
  };

  const { data, isFetching, isRefetching, refetch } = useQueryGrid<
    GetEventsGridRequestDto,
    EventGridDto
  >({
    methodName: MeteorMethodEnum.EventsGetGrid,
    request: gridRequest,
  });

  const renderCreatedAtFilter = (props: FilterDropdownProps) => (
    <GridPeriodFilter
      title="Filtrar por Fecha de Creación"
      value={gridState.filters.createdAt}
      props={props}
    />
  );

  return (
    <Card
      title={
        <Space>
          <EventsIcon />
          <span>Eventos</span>
        </Space>
      }
      extra={
        <Space.Compact>
          <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
        </Space.Compact>
      }
    >
      <Grid<EventGridDto>
        clearFilters={clearFilters}
        resetFilters={resetFilters}
        total={data?.totalCount}
        state={gridState}
        onTableChange={onTableChange}
        loading={isFetching}
        dataSource={data?.items}
        columns={[
          {
            dataIndex: 'createdAt',
            ellipsis: true,
            filterDropdown: renderCreatedAtFilter,
            filteredValue: gridState.filters.createdAt,
            render: (date: string) =>
              new DateTimeVo(date).format(DateFormatEnum.DDMMYYHHmm),
            sortOrder: gridState.sorter.createdAt,
            sorter: true,
            title: 'Fecha de creación',
            width: 150,
          },
          {
            align: 'left',
            dataIndex: 'createdBy',
            ellipsis: true,
            title: 'Usuario',
            width: 75,
          },
          {
            align: 'center',
            dataIndex: 'resource',
            ellipsis: true,
            filterMode: 'tree',
            filteredValue: gridState.filters.resource,
            filters: EventsUIUtils.getResourceGridFilters(),
            render: (type: EventResourceEnum) => EventResourceLabel[type],
            title: 'Recurso',
            width: 75,
          },
          {
            align: 'center',
            dataIndex: 'action',
            ellipsis: true,
            filterMode: 'tree',
            filteredValue: gridState.filters.action,
            filters: EventsUIUtils.getActionsGridFilters(),
            render: (type: EventActionEnum) => EventActionLabel[type],
            title: 'Acción',
            width: 75,
          },
          {
            align: 'center',
            ellipsis: true,
            render: (_, event: EventGridDto) => (
              <Space.Compact size="small">
                <Button
                  type="text"
                  onClick={() =>
                    navigate(`/${event.resource}/${event.resourceId}`)
                  }
                  htmlType="button"
                  tooltip={{ title: 'Ver Detalle' }}
                  icon={<ViewIcon />}
                />
              </Space.Compact>
            ),
            title: 'Acciones',
            width: 50,
          },
        ]}
      />
    </Card>
  );
};
