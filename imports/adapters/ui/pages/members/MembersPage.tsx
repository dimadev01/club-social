import { CreditCardOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Flex, Space, Table } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import React from 'react';
import { Link } from 'react-router-dom';

import { GetMembersGridRequestDto } from '@adapters/members/dtos/get-members-grid-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { AppUrl } from '@adapters/ui/app.enum';
import { Button } from '@adapters/ui/components/Button';
import { MembersGridCsvDownloaderButton } from '@adapters/ui/components/Members/MembersGridCsvDownloader';
import { TableNewV } from '@adapters/ui/components/Table/TableNew';
import { TableNewButton } from '@adapters/ui/components/Table/TableNewButton';
import { TableReloadButton } from '@adapters/ui/components/Table/TableReloadButton';
import { useMembers } from '@adapters/ui/hooks/members/useMembers';
import { useNavigate } from '@adapters/ui/hooks/useNavigate';
import { useQueryGrid } from '@adapters/ui/hooks/useQueryGrid';
import { useTable } from '@adapters/ui/hooks/useTable';
import { MemberGridModelDto } from '@application/members/dtos/member-grid-model-dto';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryEnum,
  MemberCategoryLabel,
  MemberStatusEnum,
  MemberStatusLabel,
  getMemberCategoryFilters,
  getMemberStatusFilters,
} from '@domain/members/member.enum';
import { FindPaginatedMembersResponse } from '@domain/members/repositories/member-repository.types';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { UrlUtils } from '@shared/utils/url.utils';

export const MembersPage = () => {
  const navigate = useNavigate();

  const { gridState, setGridState } = useTable<MemberGridModelDto>({
    defaultFilters: { status: [MemberStatusEnum.ACTIVE] },
    defaultSorter: { _id: 'ascend' },
  });

  const { data: members } = useMembers({
    category: (gridState.filters?.category as MemberCategoryEnum[]) ?? null,
    status: (gridState.filters?.status as MemberStatusEnum[]) ?? null,
  });

  const sorter = { ...gridState.sorter };

  if (sorter._id) {
    sorter['user.profile.firstName'] = sorter._id;

    sorter['user.profile.lastName'] = sorter._id;

    delete sorter._id;
  }

  const gridRequest: GetMembersGridRequestDto = {
    filterByCategory: gridState.filters?.category as MemberCategoryEnum[],
    filterByDebtStatus: gridState.filters?.pendingTotal,
    filterById: gridState.filters?._id,
    filterByStatus: gridState.filters?.status as MemberStatusEnum[],
    limit: gridState.pageSize,
    page: gridState.page,
    sorter,
  };

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    MemberGridModelDto,
    FindPaginatedMembersResponse<MemberGridModelDto>,
    GetMembersGridRequestDto
  >({
    methodName: MeteorMethodEnum.MembersGetGrid,
    request: gridRequest,
  });

  const renderSummary = () => (
    <Table.Summary>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} />
        <Table.Summary.Cell index={1} />
        <Table.Summary.Cell index={2} />
        <Table.Summary.Cell index={3}>
          <Flex justify="end">
            {data
              ? new Money(data.totals.membership).formatWithCurrency()
              : '-'}
          </Flex>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <Flex justify="end">
            {data
              ? new Money(data.totals.electricity).formatWithCurrency()
              : '-'}
          </Flex>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5}>
          <Flex justify="end">
            {data ? new Money(data.totals.guest).formatWithCurrency() : '-'}
          </Flex>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6}>
          <Flex justify="end">
            {data ? new Money(data.totals.total).formatWithCurrency() : '-'}
          </Flex>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7} />
      </Table.Summary.Row>
    </Table.Summary>
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Socios' }]}
      />

      <Card
        title="Socios"
        extra={
          <Space.Compact>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            <MembersGridCsvDownloaderButton request={gridRequest} />

            {SecurityUtils.isInRole(
              PermissionEnum.CREATE,
              ScopeEnum.MEMBERS,
            ) && <TableNewButton to={AppUrl.MembersNew} />}
          </Space.Compact>
        }
      >
        <TableNewV<MemberGridModelDto>
          total={data?.totalCount}
          state={gridState}
          setGridState={setGridState}
          loading={isLoading}
          dataSource={data?.items}
          summary={renderSummary}
          rowClassName={(member) => {
            if (member.pendingTotal > 0) {
              return 'bg-red-100 dark:bg-red-950';
            }

            return '';
          }}
          columns={[
            {
              dataIndex: '_id',
              filterSearch: true,
              filteredValue: gridState.filters?._id,
              filters:
                members?.map((member) => ({
                  text: member.name,
                  value: member._id,
                })) ?? [],
              render: (_id: string, member: MemberGridModelDto) => (
                <Link to={`${AppUrl.Members}/${_id}`}>{member.name}</Link>
              ),
              sortOrder: gridState.sorter._id,
              sorter: true,
              title: 'Socio',
            },
            {
              align: 'center',
              dataIndex: 'category',
              filteredValue: gridState.filters?.category,

              filters: getMemberCategoryFilters(),
              render: (category: MemberCategoryEnum) =>
                MemberCategoryLabel[category],
              title: 'Categoría',
              width: 150,
            },
            {
              align: 'center',
              dataIndex: 'status',
              defaultFilteredValue: [MemberStatusEnum.ACTIVE],
              filterResetToDefaultFilteredValue: true,
              filteredValue: gridState.filters?.status,
              filters: getMemberStatusFilters(),
              render: (status: MemberStatusEnum) => MemberStatusLabel[status],
              title: 'Estado',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'pendingMembership',
              render: (pendingMembership: number) =>
                new Money(pendingMembership).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingMembership,
              sorter: true,
              title: 'Deuda Cuota',
              width: 125,
            },
            {
              align: 'right',
              dataIndex: 'pendingElectricity',
              render: (pendingElectricity: number) =>
                new Money(pendingElectricity).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingElectricity,
              sorter: true,
              title: 'Deuda Luz',
              width: 125,
            },
            {
              align: 'right',
              dataIndex: 'pendingGuest',
              render: (pendingGuest: number) =>
                new Money(pendingGuest).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingGuest,
              sorter: true,
              title: 'Deuda Invitado',
              width: 125,
            },
            {
              align: 'right',
              dataIndex: 'pendingTotal',
              filterMultiple: false,
              filteredValue: gridState.filters?.pendingTotal,
              filters: [
                {
                  text: 'Con deuda',
                  value: 'true',
                },
                {
                  text: 'Sin deuda',
                  value: 'false',
                },
              ],
              render: (pendingTotal: number) =>
                new Money(pendingTotal).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingTotal,
              sorter: true,
              title: 'Deuda Total',
              width: 125,
            },
            {
              align: 'center',
              render: (_, member: MemberGridModelDto) => (
                <ButtonGroup size="small">
                  <Button
                    type="text"
                    icon={<FileSearchOutlined />}
                    onClick={() =>
                      navigate(
                        UrlUtils.navigate(AppUrl.Dues, {
                          memberIds: [member._id],
                        }),
                      )
                    }
                    tooltip={{ title: 'Ver cobros' }}
                  />
                  <Button
                    type="text"
                    icon={<CreditCardOutlined />}
                    onClick={() =>
                      navigate(
                        UrlUtils.navigate(AppUrl.Payments, {
                          memberId: member._id,
                        }),
                      )
                    }
                    tooltip={{ title: 'Ver Pagos' }}
                  />
                </ButtonGroup>
              ),
              title: 'Acciones',
              width: 100,
            },
          ]}
        />
      </Card>
    </>
  );
};
