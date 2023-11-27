import React from 'react';
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
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
import { ARS } from '@dinero.js/currencies';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  getDueCategoryOptions,
} from '@domain/dues/due.enum';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCreateDue } from '@ui/hooks/dues/useCreateDue';
import { useDue } from '@ui/hooks/dues/useDue';
import { useUpdateDue } from '@ui/hooks/dues/useUpdateDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useDeleteMovement } from '@ui/hooks/movements/useDeleteMovement';

type FormValues = {
  amount: number;
  category: DueCategoryEnum;
  date: Dayjs;
  memberIds: string[] | undefined;
  notes: string | undefined;
};

export const DueDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const category = useWatch(['category'], form);

  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { message } = App.useApp();

  const { data: due, fetchStatus: dueFetchStatus, refetch } = useDue(id);

  const createDue = useCreateDue();

  const updateDue = useUpdateDue();

  const deleteMovement = useDeleteMovement(() => {
    message.success('Movimiento eliminado');

    navigate(-1);
  });

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  // const { data: categoriesByType, isLoading: isLoadingCategoriesByType } =
  //   useCategoriesByType(type);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    let date: string;

    if (values.category === DueCategoryEnum.Membership) {
      date = values.date.utc().startOf('month').toISOString();
    } else {
      date = values.date.utc().startOf('day').toISOString();
    }

    if (!due) {
      await createDue.mutateAsync(
        {
          amount: MoneyUtils.toCents(values.amount),
          category: values.category,
          date,
          memberIds: values.memberIds ?? [],
          notes: values.notes ?? null,
        },
        {
          onSuccess: () => {
            message.success('Cobro creado');

            form.setFieldValue('memberIds', []);
          },
        }
      );
    } else {
      await updateDue.mutateAsync(
        {
          amount: MoneyUtils.toCents(values.amount),
          category: values.category,
          date,
          id: due._id,
          memberId: values.memberIds ? values.memberIds[0] : '',
          notes: values.notes ?? null,
        },
        {
          onSuccess: () => {
            message.success('Cobro actualizado');

            refetch();
          },
        }
      );
    }
  };

  const isLoading = dueFetchStatus === 'fetching';

  if (id && !due && !isLoading) {
    return <NotFound />;
  }

  // const getPriceForCategory = (value: CategoryEnum): number => {
  //   const foundCategory = find(categoriesByType, { code: value });

  //   return foundCategory?.amount
  //     ? MoneyUtils.fromCents(foundCategory.amount)
  //     : 0;
  // };

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
          {
            title: 'Inicio',
          },
          {
            title: <NavLink to={AppUrl.Dues}>Cobros</NavLink>,
          },
          {
            title: due
              ? `${due.date} - ${DueCategoryLabel[due.category]} - ${
                  due.amountFormatted
                }`
              : 'Nuevo Cobro',
          },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <Card>
          <Form<FormValues>
            layout="vertical"
            disabled={!canCreateOrUpdateMovement}
            form={form}
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              amount: due?.amount ? MoneyUtils.fromCents(due.amount) : 0,
              category: due?.category ?? DueCategoryEnum.Membership,
              date: due?.date
                ? dayjs.utc(due.date, DateFormatEnum.DDMMYYYY)
                : undefined,
              memberIds: due?.memberId ? [due.memberId] : [],
              notes: due?.notes,
            }}
          >
            <Form.Item
              label="Categoría"
              name="category"
              rules={[{ required: true }]}
            >
              <Select
                disabled={!!due}
                onChange={() => {
                  form.setFieldValue('amount', null);
                }}
                options={getDueCategoryOptions()}
              />
            </Form.Item>

            <Form.Item
              className="cs-form-item-extra"
              // help={
              //   category === CategoryEnum.MembershipDebt && (
              //     <ButtonGroup>
              //       <Button
              //         size="small"
              //         htmlType="button"
              //         type="ghost"
              //         onClick={() => {
              //           form.setFieldValue(
              //             'memberIds',
              //             members
              //               ?.filter(
              //                 (member) =>
              //                   member.category === MemberCategoryEnum.Member &&
              //                   member.status === MemberStatusEnum.Active
              //               )
              //               .map((member) => member._id) ?? []
              //           );
              //         }}
              //       >
              //         Seleccionar todos los socios
              //       </Button>
              //       <Button
              //         size="small"
              //         htmlType="button"
              //         type="ghost"
              //         onClick={() => {
              //           form.setFieldValue(
              //             'memberIds',
              //             members
              //               ?.filter(
              //                 (member) =>
              //                   member.category === MemberCategoryEnum.Cadet &&
              //                   member.status === MemberStatusEnum.Active
              //               )
              //               .map((member) => member._id) ?? []
              //           );
              //         }}
              //       >
              //         Seleccionar todos los cadetes
              //       </Button>
              //     </ButtonGroup>
              //   )
              // }
              label="Socio/s"
              name="memberIds"
              rules={[{ required: true }, { min: 1, type: 'array' }]}
            >
              <Select
                mode="multiple"
                disabled={
                  isLoadingMembers || !canCreateOrUpdateMovement || !!due
                }
                loading={isLoadingMembers}
                options={members?.map((member) => ({
                  label: member.name,
                  value: member._id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="date"
              label="Fecha"
              rules={[{ required: true }, { type: 'date' }]}
            >
              <DatePicker
                disabled={!!due}
                picker={
                  category === DueCategoryEnum.Membership ? 'month' : 'date'
                }
                className="w-full"
                disabledDate={(current) => current.isAfter(dayjs())}
              />
            </Form.Item>

            <Form.Item
              label="Importe"
              name="amount"
              rules={[{ required: true }, { min: 1, type: 'number' }]}
              status="error"
            >
              <InputNumber
                className="w-40"
                prefix={ARS.code}
                precision={2}
                decimalSeparator=","
                step={100}
              />
            </Form.Item>

            <Form.Item
              label="Notas"
              rules={[{ whitespace: true }]}
              name="notes"
            >
              <Input.TextArea rows={1} />
            </Form.Item>

            <FormButtons
              scope={ScopeEnum.Movements}
              isLoading={createDue.isLoading || updateDue.isLoading}
              isDisabled={createDue.isLoading || updateDue.isLoading}
              showDeleteButton={!!due}
              onClickDelete={() =>
                due && deleteMovement.mutate({ id: due._id })
              }
            />
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
