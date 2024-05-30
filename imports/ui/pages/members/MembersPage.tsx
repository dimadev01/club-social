import { CreditCardOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import React, { useRef, useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import { Money } from '@application/value-objects/money.value-object';
import {
  MemberCategoryEnum,
  MemberCategoryLabel,
  MemberStatusEnum,
  MemberStatusLabel,
  getMemberCategoryFilters,
  getMemberStatusFilters,
} from '@domain/members/member.enum';
import { GetMemberGridResponse } from '@domain/members/use-cases/get-member/get-member-grid.response';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { GetMembersGridRequestDto } from '@infra/controllers/types/get-members-grid-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { MembersGridCsvDownloaderButton } from '@ui/components/Members/MembersGridCsvDownloader';
import { TableNew } from '@ui/components/Table/TableNew';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TablePrintButton } from '@ui/components/Table/TablePrintButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useMembersToExport } from '@ui/hooks/members/useGetMembersToExport';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useNavigate } from '@ui/hooks/useNavigate';
import { useQueryGrid } from '@ui/hooks/useQueryGrid';
import { useTable } from '@ui/hooks/useTable';

export const MembersPage = () => {
  const navigate = useNavigate();

  const { gridState, setGridState } = useTable<GetMemberGridResponse>({
    defaultFilters: { status: [MemberStatusEnum.ACTIVE] },
    defaultSorter: { _id: 'ascend' },
  });

  const [isExportingToCsv, setIsExportingToCsv] = useState(false);

  const { data: members } = useMembers({
    category: (gridState.filters?.category as MemberCategoryEnum[]) ?? null,
    status: (gridState.filters?.status as MemberStatusEnum[]) ?? null,
  });

  const gridRequest: GetMembersGridRequestDto = {
    categoryFilter:
      (gridState.filters?.category as MemberCategoryEnum[]) ?? null,
    debtStatusFilter: gridState.filters?.pendingTotal ?? null,
    idFilter: gridState.filters?._id ?? null,
    limit: gridState.pageSize,
    page: gridState.page,
    search: gridState.search,
    sorter: gridState.sorter,
    statusFilter: (gridState.filters?.status as MemberStatusEnum[]) ?? null,
  };

  const getMembersToExport = useMembersToExport();

  const { data, isLoading, isRefetching, refetch } = useQueryGrid<
    GetMemberGridResponse,
    GetMembersGridRequestDto
  >({
    methodName: MeteorMethodEnum.MembersGetGrid,
    request: gridRequest,
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

            <MembersGridCsvDownloaderButton request={gridRequest} />

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
          state={gridState}
          setGridState={setGridState}
          loading={isLoading}
          dataSource={data?.items}
          rowClassName={(member) => {
            if (member.pendingTotal > 0) {
              return 'bg-red-100 dark:bg-red-950';
            }

            return '';
          }}
          columns={[
            {
              dataIndex: '_id',
              defaultFilteredValue: gridState.filters?._id,
              filterSearch: true,
              filteredValue: gridState.filters?._id,
              filters:
                members?.map((member) => ({
                  text: member.name,
                  value: member._id,
                })) ?? [],
              render: (_id: string, member: GetMemberGridResponse) => (
                <NavLink to={`${AppUrl.Members}/${_id}`}>{member.name}</NavLink>
              ),
              sortOrder: gridState.sorter._id,
              sorter: true,
              title: 'Socio',
            },
            {
              align: 'center',
              dataIndex: 'category',
              defaultFilteredValue: gridState.filters?.category,
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
              defaultFilteredValue: gridState.filters?.status,
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
              defaultFilteredValue: gridState.filters?.pendingTotal,
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
              render: (_, member: GetMemberGridResponse) => (
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
