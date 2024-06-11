import { CreditCardOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { FaFileInvoiceDollar, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryEnum,
  MemberCategoryLabel,
  MemberStatusEnum,
  MemberStatusLabel,
  getMemberCategoryColumnFilters,
  getMemberStatusColumnFilters,
} from '@domain/members/member.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Grid } from '@ui/components/Grid/Grid';
import { GridUtils } from '@ui/components/Grid/grid.utils';
import { GridNewButton } from '@ui/components/Grid/GridNewButton';
import { GridReloadButton } from '@ui/components/Grid/GridReloadButton';
import { useTable } from '@ui/components/Grid/useTable';
import { MembersGridCsvDownloaderButton } from '@ui/components/Members/MembersGridCsvDownloader';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useQueryGrid } from '@ui/hooks/query/useQueryGrid';
import { useNavigate } from '@ui/hooks/ui/useNavigate';

export const MembersPage = () => {
  const navigate = useNavigate();

  const { state: gridState, onTableChange } = useTable<MemberGridDto>({
    defaultFilters: {
      category: [],
      id: [],
      pendingTotal: [],
      status: [MemberStatusEnum.ACTIVE],
    },
    defaultSorter: { id: 'ascend' },
  });

  const { data: members } = useMembers();

  const sorter = { ...gridState.sorter };

  if (sorter.id) {
    sorter.firstName = sorter.id;

    sorter.lastName = sorter.id;

    delete sorter.id;
  }

  const gridRequest: GetMembersGridRequestDto = {
    filterByCategory: gridState.filters.category as MemberCategoryEnum[],
    filterByDebtStatus: gridState.filters.pendingTotal,
    filterById: gridState.filters.id,
    filterByStatus: gridState.filters.status as MemberStatusEnum[],
    limit: gridState.pageSize,
    page: gridState.page,
    sorter,
  };

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetMembersGridRequestDto,
    MemberGridDto
  >({
    methodName: MeteorMethodEnum.MembersGetGrid,
    request: gridRequest,
  });

  // const renderSummary = () => (
  //   <Table.Summary>
  //     <Table.Summary.Row>
  //       <Table.Summary.Cell index={0} />
  //       <Table.Summary.Cell index={1} />
  //       <Table.Summary.Cell index={2} />
  //       <Table.Summary.Cell index={3}>
  //         <Flex justify="end">
  //           {data
  //             ? new Money({
  //                 amount: data.totals.membership,
  //               }).formatWithCurrency()
  //             : '-'}
  //         </Flex>
  //       </Table.Summary.Cell>
  //       <Table.Summary.Cell index={4}>
  //         <Flex justify="end">
  //           {data
  //             ? new Money({
  //                 amount: data.totals.electricity,
  //               }).formatWithCurrency()
  //             : '-'}
  //         </Flex>
  //       </Table.Summary.Cell>
  //       <Table.Summary.Cell index={5}>
  //         <Flex justify="end">
  //           {data
  //             ? new Money({ amount: data.totals.guest }).formatWithCurrency()
  //             : '-'}
  //         </Flex>
  //       </Table.Summary.Cell>
  //       <Table.Summary.Cell index={6}>
  //         <Flex justify="end">
  //           {data
  //             ? new Money({ amount: data.totals.total }).formatWithCurrency()
  //             : '-'}
  //         </Flex>
  //       </Table.Summary.Cell>
  //       <Table.Summary.Cell index={7} />
  //     </Table.Summary.Row>
  //   </Table.Summary>
  // );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Socios' }]}
      />

      <Card
        title={
          <Space>
            <FaUsers />
            <span>Socios</span>
          </Space>
        }
        extra={
          <Space.Compact>
            <GridReloadButton isRefetching={isRefetching} refetch={refetch} />
            <MembersGridCsvDownloaderButton request={gridRequest} />
            <GridNewButton scope={ScopeEnum.MEMBERS} to={AppUrl.MembersNew} />
          </Space.Compact>
        }
      >
        <Grid<MemberGridDto>
          total={data?.totalCount}
          state={gridState}
          onTableChange={onTableChange}
          loading={isLoading}
          dataSource={data?.items}
          // summary={renderSummary}
          rowClassName={(member) => {
            if (member.pendingTotal > 0) {
              return 'bg-red-100 dark:bg-red-950';
            }

            return '';
          }}
          columns={[
            {
              dataIndex: 'id',
              filterSearch: true,
              filteredValue: gridState.filters.id,
              filters: GridUtils.getMembersForFilter(members),
              render: (id: string, member: MemberGridDto) => (
                <Link to={`${AppUrl.Members}/${id}`}>{member.name}</Link>
              ),
              sortOrder: gridState.sorter.id,
              sorter: true,
              title: 'Socio',
            },
            {
              align: 'center',
              dataIndex: 'category',
              filteredValue: gridState.filters.category,

              filters: getMemberCategoryColumnFilters(),
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
              filteredValue: gridState.filters.status,
              filters: getMemberStatusColumnFilters(),
              render: (status: MemberStatusEnum) => MemberStatusLabel[status],
              title: 'Estado',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'pendingMembership',
              render: (pendingMembership: number) =>
                new Money({ amount: pendingMembership }).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingMembership,
              sorter: true,
              title: 'Deuda Cuota',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'pendingElectricity',
              render: (pendingElectricity: number) =>
                new Money({ amount: pendingElectricity }).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingElectricity,
              sorter: true,
              title: 'Deuda Luz',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'pendingGuest',
              render: (pendingGuest: number) =>
                new Money({ amount: pendingGuest }).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingGuest,
              sorter: true,
              title: 'Deuda Invitado',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'pendingTotal',
              filterMultiple: false,
              filteredValue: gridState.filters.pendingTotal,
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
                new Money({ amount: pendingTotal }).formatWithCurrency(),
              sortOrder: gridState.sorter.pendingTotal,
              sorter: true,
              title: 'Deuda Total',
              width: 150,
            },
            {
              align: 'center',
              render: (_, member: MemberGridDto) => (
                <Space.Compact size="small">
                  <Button
                    type="text"
                    icon={<FaFileInvoiceDollar />}
                    onClick={() =>
                      navigate(
                        UrlUtils.navigate(AppUrl.Dues, {
                          filters: { memberId: [member.id] },
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
                          filters: { memberId: [member.id] },
                        }),
                      )
                    }
                    tooltip={{ title: 'Ver Pagos' }}
                  />
                </Space.Compact>
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
