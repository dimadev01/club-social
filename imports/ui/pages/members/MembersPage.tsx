import { Breadcrumb, Card } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import React, { useRef, useState } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import { getMemberCategoryFilters } from '@domain/members/member.enum';
import { GetMemberGridResponse } from '@domain/members/use-cases/get-member/get-member-grid.response';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { AppUrl } from '@ui/app.enum';
import { TableNew } from '@ui/components/Table/TableNew';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TablePrintButton } from '@ui/components/Table/TablePrintButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useGridNew } from '@ui/hooks/useGridNew';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';

export const MembersPage = () => {
  const [gridState, setGridState] = useGridNew();

  console.log(gridState);

  const navigate = useNavigate();

  const [isExportingToCsv, setIsExportingToCsv] = useState(false);

  const { data, isLoading, isRefetching, refetch } =
    useQueryGrid<GetMemberGridResponse>({
      methodName: MeteorMethodEnum.MembersGetGrid,
      request: {
        filters: gridState.filters,
        page: gridState.page,
        pageSize: gridState.pageSize,
        search: gridState.search,
        sorter: gridState.sorter,
      },
    });

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

            {/* <CsvDownloader
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
                  MeteorMethodEnum.MembersGetForCsv,
                  request,
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
            </CsvDownloader> */}

            {Roles.userIsInRole(
              user,
              PermissionEnum.CREATE,
              ScopeEnum.MEMBERS,
            ) && <TableNewButton to={AppUrl.MembersNew} />}
          </ButtonGroup>
        }
      >
        <TableNew<GetMemberGridResponse>
          total={data?.totalCount ?? 0}
          showSearch
          state={gridState}
          setGridState={setGridState}
          loading={isLoading}
          dataSource={data?.items}
          // rowClassName={(member) => {
          //   if (member.totalBalance < 0) {
          //     return 'bg-red-50 dark:bg-red-400';
          //   }

          //   if (member.totalBalance > 0) {
          //     return 'bg-green-50 dark:bg-green-400';
          //   }

          //   return '';
          // }}
          columns={[
            {
              dataIndex: 'name',
              render: (name: string, member: GetMemberGridResponse) => (
                <NavLink to={`${AppUrl.Members}/${member._id}`}>{name}</NavLink>
              ),
              sortOrder: gridState.sorter.name,
              sorter: true,
              title: 'Socio',
            },
            {
              dataIndex: 'category',
              filters: getMemberCategoryFilters(),
              sortOrder: gridState.sorter.category,
              title: 'Category',
            },

            // {
            //   dataIndex: 'emails',
            //   render: (emails: Meteor.UserEmail[] | null) =>
            //     emails && (
            //       <Space direction="vertical">
            //         {emails.map((email) => (
            //           <Typography.Text
            //             key={email.address}
            //             copyable={{ text: email.address }}
            //           >
            //             <Tooltip
            //               title={
            //                 email.verified
            //                   ? 'Email verificado'
            //                   : 'Email no verificado'
            //               }
            //               key={email.address}
            //             >
            //               {email.address}
            //             </Tooltip>
            //           </Typography.Text>
            //         ))}
            //       </Space>
            //     ),
            //   title: 'Emails',
            // },
            // {
            //   align: 'center',
            //   dataIndex: 'category',
            //   defaultFilteredValue: gridState.filters.category,
            //   filters: getMemberCategoryFilters(),
            //   render: (category: MemberCategoryEnum) =>
            //     MemberCategoryLabel[category],
            //   title: 'Categoría',
            // },
            // {
            //   align: 'center',
            //   dataIndex: 'status',
            //   defaultFilteredValue: gridState.filters.status,
            //   filters: getMemberStatusFilters(),
            //   render: (status: MemberStatusEnum) => MemberStatusLabel[status],
            //   title: 'Estado',
            // },
            // {
            //   align: 'right',
            //   dataIndex: 'electricityBalance',
            //   defaultSortOrder:
            //     gridState.sortField === 'electricityBalance'
            //       ? gridState.sortOrder
            //       : undefined,
            //   render: (electricityBalance: number) =>
            //     MoneyUtils.formatCents(electricityBalance),
            //   sorter: true,
            //   title: 'Saldo luz',
            // },
            // {
            //   align: 'right',
            //   dataIndex: 'guestBalance',
            //   defaultSortOrder:
            //     gridState.sortField === 'guestBalance'
            //       ? gridState.sortOrder
            //       : undefined,
            //   render: (guestBalance: number) =>
            //     MoneyUtils.formatCents(guestBalance),
            //   sorter: true,
            //   title: 'Saldo invitado',
            // },
            // {
            //   align: 'right',
            //   dataIndex: 'membershipBalance',
            //   defaultSortOrder:
            //     gridState.sortField === 'membershipBalance'
            //       ? gridState.sortOrder
            //       : undefined,
            //   render: (membershipBalance: number) =>
            //     MoneyUtils.formatCents(membershipBalance),
            //   sorter: true,
            //   title: 'Saldo cuota',
            // },
            // {
            //   align: 'right',
            //   dataIndex: 'totalBalance',
            //   defaultSortOrder:
            //     gridState.sortField === 'totalBalance'
            //       ? gridState.sortOrder
            //       : undefined,
            //   render: (totalBalance: number) =>
            //     MoneyUtils.formatCents(totalBalance),
            //   sorter: true,
            //   title: 'Saldo Total',
            // },
            // {
            //   align: 'center',
            //   render: (_, member: MemberGridDto) => (
            //     <ButtonGroup size="small">
            //       <Button
            //         type="text"
            //         icon={<FileSearchOutlined />}
            //         onClick={() =>
            //           navigate(
            //             UrlUtils.navigate(AppUrl.Dues, {
            //               memberIds: [member._id],
            //             }),
            //           )
            //         }
            //         tooltip={{ title: 'Ver cobros' }}
            //       />
            //       <Button
            //         type="text"
            //         icon={<CreditCardOutlined />}
            //         onClick={() =>
            //           navigate(
            //             UrlUtils.navigate(AppUrl.Payments, {
            //               memberId: member._id,
            //             }),
            //           )
            //         }
            //         tooltip={{ title: 'Ver Pagos' }}
            //       />
            //     </ButtonGroup>
            //   ),
            //   title: 'Acciones',
            // },
          ]}
        />
      </Card>
    </>
  );
};
