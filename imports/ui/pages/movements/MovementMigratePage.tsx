import React, { useEffect } from 'react';
import {
  App,
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Skeleton,
} from 'antd';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { ARS } from '@dinero.js/currencies';
import {
  CategoryTypeEnum,
  MemberCategories,
} from '@domain/categories/category.enum';
import { MigrateMovementRequestDto } from '@domain/movements/use-cases/migrate-movement/migrate-movement-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCategoriesByType } from '@ui/hooks/categories/useCategoriesByType';
import { usePendingDues } from '@ui/hooks/dues/usePendingDues';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useMigrateMovement } from '@ui/hooks/movements/useMigrateMovement';
import { useMovement } from '@ui/hooks/movements/useMovement';
import { PaymentMemberDuesCard } from '@ui/pages/payments/PaymentMemberDuesCard';

type FormDueValue = {
  amount: number;
  dueId: string;
  isSelected: boolean;
};

type FormDuesValue = {
  dues: FormDueValue[];
};

type FormValues = {
  dues: FormDuesValue[];
};

export const MovementMigratePage = () => {
  const [form] = Form.useForm<FormValues>();

  const { id } = useParams<{ id?: string }>();

  const { data: movement, fetchStatus: movementFetchStatus } = useMovement(id);

  // const navigate = useNavigate();

  const { message } = App.useApp();

  const migrateMovement = useMigrateMovement();

  const { data: members, isLoading: isLoadingMembers } = useMembers(
    movement ? MemberCategories.includes(movement.category) : false
  );

  const { data: pendingDues } = usePendingDues({
    memberIds: movement?.memberId ? [movement.memberId] : [],
  });

  console.log(movement);

  const { data: categoriesByType, isLoading: isLoadingCategoriesByType } =
    useCategoriesByType(CategoryTypeEnum.Income);

  useEffect(() => {
    if (pendingDues?.length) {
      const groupedDuesByMember = groupBy(pendingDues, 'memberId');

      const formDuesToSet = Object.entries(groupedDuesByMember).map(
        ([memberId, dues]) => ({
          dues: dues.map((due) => ({
            amount: MoneyUtils.fromCents(due.amount),
            dueId: due._id,
            isSelected: false,
          })),
          memberId,
          notes: movement?.notes ?? null,
        })
      );

      form.setFieldValue('dues', formDuesToSet);
    }
  }, [pendingDues, movement, form]);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    console.log(values);

    if (movement) {
      const request: MigrateMovementRequestDto = {
        dues: values.dues[0].dues
          .filter((d) => d.isSelected)
          .map((due) => ({
            amount: MoneyUtils.toCents(due.amount),
            dueId: due.dueId,
          })),
        id: movement._id,
      };

      console.log(request);

      migrateMovement.mutate(request, {
        onSuccess: () => {
          message.success('Movimiento migrado');
        },
      });
    }
  };

  const isLoading = movementFetchStatus === 'fetching';

  if (id && !movement && !isLoading) {
    return <NotFound />;
  }

  const canCreateOrUpdateMovement =
    Roles.userIsInRole(user, PermissionEnum.Create, ScopeEnum.Movements) ||
    Roles.userIsInRole(user, PermissionEnum.Update, ScopeEnum.Movements);

  /**
   * Renders component
   */
  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <NavLink to={AppUrl.Movements}>Movimientos</NavLink> },
          { title: 'Migrar movimiento' },
        ]}
      />

      <Skeleton active loading={isLoading}>
        {movement?.memberId && (
          <Card>
            <Form<FormValues>
              layout="vertical"
              disabled={!canCreateOrUpdateMovement}
              requiredMark={false}
              form={form}
              onFinish={(values) => handleSubmit(values)}
              initialValues={{ dues: [] }}
            >
              <Form.Item label="Fecha">
                <DatePicker
                  disabled
                  value={DateUtils.utc(movement.date, DateFormatEnum.DDMMYYYY)}
                  format={DateFormatEnum.DDMMYYYY}
                  className="w-full"
                  disabledDate={(current) => current.isAfter(dayjs())}
                />
              </Form.Item>

              <Form.Item label="Socio">
                <Select
                  loading={isLoadingMembers}
                  disabled
                  value={movement.memberId}
                  options={members?.map((member) => ({
                    label: member.name,
                    value: member._id,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Categoría">
                <Select
                  disabled
                  value={movement.category}
                  loading={isLoadingCategoriesByType}
                  options={
                    categoriesByType?.map((categoryByType) => ({
                      label: categoryByType.name,
                      value: categoryByType.code,
                    })) ?? []
                  }
                />
              </Form.Item>

              <Form.Item label="Importe a migrar">
                <InputNumber
                  value={MoneyUtils.fromCents(movement.amount)}
                  className="w-32"
                  prefix={ARS.code}
                  precision={0}
                  decimalSeparator=","
                  step={100}
                  disabled
                />
              </Form.Item>

              <PaymentMemberDuesCard
                memberId={movement.memberId}
                dues={pendingDues}
                showNotes={false}
              />

              <Form.Item label="Notas">
                <Input.TextArea value={movement.notes ?? undefined} rows={1} />
              </Form.Item>

              <FormButtons
                scope={ScopeEnum.Movements}
                isLoading={migrateMovement.isLoading}
                isSaveDisabled={migrateMovement.isLoading}
                isBackDisabled={migrateMovement.isLoading}
                showDeleteButton={false}
                showBackButton={false}
              />
            </Form>
          </Card>
        )}
      </Skeleton>
    </>
  );
};
