import {
  CreditCardOutlined,
  FileExcelOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Space, Tooltip, Typography } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import React, { useRef, useState } from 'react';
import CsvDownloader from 'react-csv-downloader';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import {
  MemberCategoryEnum,
  MemberCategoryLabel,
  MemberStatusEnum,
  MemberStatusLabel,
  getMemberCategoryFilters,
  getMemberStatusFilters,
} from '@domain/members/member.enum';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TablePrintButton } from '@ui/components/Table/TablePrintButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembersGrid } from '@ui/hooks/members/useMembersGrid';
import { useGrid } from '@ui/hooks/useGrid';

export const MembersPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'name',
    sortOrder: 'ascend',
  });

  const navigate = useNavigate();

  const [isExportingToCsv, setIsExportingToCsv] = useState(false);

  const gridRequest: PaginatedRequestDto = {
    filters: gridState.filters,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  };

  const { data, isLoading, isRefetching, refetch } =
    useMembersGrid(gridRequest);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[{ title: 'Inicio' }, { title: 'Socios' }]}
      />

      <Card
        ref={componentRef}
        title="Socios"
        extra={
          <ButtonGroup>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            <TablePrintButton
              onClick={() => handlePrint()}
              isDisabled={isRefetching}
            />

            <CsvDownloader
              columns={[
                {
                  displayName: 'ID',
                  id: '_id',
                },
                {
                  displayName: 'Nombre',
                  id: 'name',
                },
                {
                  displayName: 'Categoría',
                  id: 'category',
                },
                {
                  displayName: 'Estado',
                  id: 'status',
                },
                {
                  displayName: 'Emails',
                  id: 'emails',
                },
                {
                  displayName: 'Teléfono',
                  id: 'phone',
                },
                {
                  displayName: 'Deuda de luz',
                  id: 'electricityDebt',
                },
                {
                  displayName: 'Deuda de invitado',
                  id: 'guestDebt',
                },
                {
                  displayName: 'Deuda de cuota',
                  id: 'membershipDebt',
                },
                {
                  displayName: 'Deuda total',
                  id: 'totalDebt',
                },
              ]}
              filename={DateUtils.c().format(DateFormatEnum.DateTime)}
              datas={async () => {
                setIsExportingToCsv(true);

                const response = await Meteor.callAsync(
                  MethodsEnum.MembersGetForCsv,
                  gridRequest,
                );

                setIsExportingToCsv(false);

                return Promise.resolve(response.data);
              }}
            >
              <Button
                loading={isExportingToCsv}
                disabled={isExportingToCsv}
                tooltip={{ title: 'Descargar CSV' }}
                htmlType="button"
                type="text"
                icon={<FileExcelOutlined />}
              />
            </CsvDownloader>

            {Roles.userIsInRole(
              user,
              PermissionEnum.Create,
              ScopeEnum.Members,
            ) && <TableNewButton to={AppUrl.MembersNew} />}
          </ButtonGroup>
        }
      >
        <Table<MemberGridDto>
          total={data?.count ?? 0}
          showSearch
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data?.data}
          rowClassName={(member) => {
            if (member.totalBalance < 0) {
              return 'bg-red-50 dark:bg-red-400';
            }

            if (member.totalBalance > 0) {
              return 'bg-green-50 dark:bg-green-400';
            }

            return '';
          }}
          columns={[
            {
              dataIndex: 'name',
              defaultSortOrder:
                gridState.sortField === 'name'
                  ? gridState.sortOrder
                  : undefined,
              render: (name: string, member: MemberGridDto) => (
                <NavLink to={`${AppUrl.Members}/${member._id}`}>{name}</NavLink>
              ),
              sorter: true,
              title: 'Socio',
            },
            {
              dataIndex: 'emails',
              render: (emails: Meteor.UserEmail[] | null) =>
                emails && (
                  <Space direction="vertical">
                    {emails.map((email) => (
                      <Typography.Text
                        key={email.address}
                        copyable={{ text: email.address }}
                      >
                        <Tooltip
                          title={
                            email.verified
                              ? 'Email verificado'
                              : 'Email no verificado'
                          }
                          key={email.address}
                        >
                          {email.address}
                        </Tooltip>
                      </Typography.Text>
                    ))}
                  </Space>
                ),
              title: 'Emails',
            },
            {
              align: 'center',
              dataIndex: 'category',
              defaultFilteredValue: gridState.filters.category,
              filters: getMemberCategoryFilters(),
              render: (category: MemberCategoryEnum) =>
                MemberCategoryLabel[category],
              title: 'Categoría',
            },
            {
              align: 'center',
              dataIndex: 'status',
              defaultFilteredValue: gridState.filters.status,
              filters: getMemberStatusFilters(),
              render: (status: MemberStatusEnum) => MemberStatusLabel[status],
              title: 'Estado',
            },
            {
              align: 'right',
              dataIndex: 'electricityBalance',
              defaultSortOrder:
                gridState.sortField === 'electricityBalance'
                  ? gridState.sortOrder
                  : undefined,
              render: (electricityBalance: number) =>
                MoneyUtils.formatCents(electricityBalance),
              sorter: true,
              title: 'Saldo luz',
            },
            {
              align: 'right',
              dataIndex: 'guestBalance',
              defaultSortOrder:
                gridState.sortField === 'guestBalance'
                  ? gridState.sortOrder
                  : undefined,
              render: (guestBalance: number) =>
                MoneyUtils.formatCents(guestBalance),
              sorter: true,
              title: 'Saldo invitado',
            },
            {
              align: 'right',
              dataIndex: 'membershipBalance',
              defaultSortOrder:
                gridState.sortField === 'membershipBalance'
                  ? gridState.sortOrder
                  : undefined,
              render: (membershipBalance: number) =>
                MoneyUtils.formatCents(membershipBalance),
              sorter: true,
              title: 'Saldo cuota',
            },
            {
              align: 'right',
              dataIndex: 'totalBalance',
              defaultSortOrder:
                gridState.sortField === 'totalBalance'
                  ? gridState.sortOrder
                  : undefined,
              render: (totalBalance: number) =>
                MoneyUtils.formatCents(totalBalance),
              sorter: true,
              title: 'Saldo Total',
            },
            {
              align: 'center',
              render: (_, member: MemberGridDto) => (
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
            },
          ]}
        />
      </Card>
    </>
  );
};
