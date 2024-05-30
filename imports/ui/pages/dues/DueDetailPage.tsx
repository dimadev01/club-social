import React from 'react';
import {
  App,
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Skeleton,
  Space,
  Tag,
} from 'antd';
import { Rule } from 'antd/es/form';
import { useWatch } from 'antd/es/form/Form';
import { Dayjs } from 'dayjs';
import { isString } from 'lodash';
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
import { ARS } from '@dinero.js/currencies';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusColor,
  DueStatusLabel,
  getDueCategoryOptions,
} from '@domain/dues/due.enum';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCreateDue } from '@ui/hooks/dues/useCreateDue';
import { useDeleteDue } from '@ui/hooks/dues/useDeleteDue';
import { useDue } from '@ui/hooks/dues/useDue';
import { useUpdateDue } from '@ui/hooks/dues/useUpdateDue';
import { useMembers } from '@ui/hooks/members/useMembers';

type FormValues = {
  amount: number;
  category: DueCategoryEnum;
  date: Dayjs;
  memberIds: string | string[] | undefined;
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

  const deleteDue = useDeleteDue(() => {
    message.success('Cobro eliminado');

    navigate(-1);
  });

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    let date: string;

    if (values.category === DueCategoryEnum.Membership) {
      date = values.date.startOf('month').format(DateFormatEnum.Date);
    } else {
      date = values.date.startOf('day').format(DateFormatEnum.Date);
    }

    if (!due) {
      createDue.mutate(
        {
          amount: MoneyUtils.toCents(values.amount),
          category: values.category,
          date,
          memberIds: Array.isArray(values.memberIds) ? values.memberIds : [],
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
      updateDue.mutate(
        {
          amount: MoneyUtils.toCents(values.amount),
          category: values.category,
          date,
          id: due._id,
          memberId: isString(values.memberIds) ? values.memberIds : '',
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

  const isFormDisabled = () => {
    if (!Roles.userIsInRole(user, PermissionEnum.Create, ScopeEnum.Dues)) {
      return false;
    }

    if (!Roles.userIsInRole(user, PermissionEnum.Update, ScopeEnum.Dues)) {
      return false;
    }

    if (due) {
      if (due.isPaid) {
        return true;
      }

      if (due.isPartiallyPaid) {
        return true;
      }
    }

    return false;
  };

  const getRulesForMemberIds = () => {
    const rules: Rule[] = [
      {
        required: true,
      },
    ];

    if (!due) {
      rules.push({ min: 1, type: 'array' });
    }

    return rules;
  };

  const renderMemberDropdown = (menu: React.ReactElement) => (
    <>
      {menu}

      {category === DueCategoryEnum.Membership && (
        <Space className="flex justify-center my-1">
          <Button
            htmlType="button"
            size="small"
            onClick={() => {
              form.setFieldValue(
                'memberIds',
                members
                  ?.filter(
                    (member) =>
                      member.category === MemberCategoryEnum.Member &&
                      member.status === MemberStatusEnum.Active
                  )
                  .map((member) => member._id) ?? []
              );
            }}
          >
            Seleccionar todos los socios
          </Button>

          <Button
            htmlType="button"
            size="small"
            onClick={() => {
              form.setFieldValue(
                'memberIds',
                members
                  ?.filter(
                    (member) =>
                      member.category === MemberCategoryEnum.Cadet &&
                      member.status === MemberStatusEnum.Active
                  )
                  .map((member) => member._id) ?? []
              );
            }}
          >
            Seleccionar todos los cadetes
          </Button>
        </Space>
      )}
    </>
  );

  /**
   * Renders component
   */
  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <NavLink to={AppUrl.Dues}>Cobros</NavLink> },
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
        <Card
          title={due ? due.memberName : 'Nuevo Cobro'}
          extra={
            due && (
              <Tag color={DueStatusColor[due.status]}>
                {DueStatusLabel[due.status]}
              </Tag>
            )
          }
        >
          <Form<FormValues>
            layout="vertical"
            form={form}
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              amount: due?.amount ? MoneyUtils.fromCents(due.amount) : 0,
              category: due?.category ?? DueCategoryEnum.Electricity,
              date: due?.date
                ? DateUtils.utc(due.date, DateFormatEnum.DDMMYYYY)
                : undefined,
              memberIds: due?.memberId ?? [],
              notes: due?.notes,
            }}
          >
            <Form.Item
              className="cs-form-item-extra"
              label="Socio/s"
              name="memberIds"
              rules={getRulesForMemberIds()}
            >
              <Select
                dropdownRender={renderMemberDropdown}
                mode={due ? undefined : 'multiple'}
                loading={isLoadingMembers}
                disabled={isFormDisabled()}
                options={members?.map((member) => ({
                  label: member.name,
                  value: member._id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Categoría"
              name="category"
              rules={[{ required: true }]}
            >
              <Select
                disabled={isFormDisabled()}
                onChange={(value) => {
                  if (due) {
                    if (value === DueCategoryEnum.Membership) {
                      form.setFieldValue(
                        'date',
                        DateUtils.utc(
                          due.date,
                          DateFormatEnum.DDMMYYYY
                        ).startOf('month')
                      );
                    }
                  } else {
                    form.setFieldValue('amount', null);
                  }
                }}
                options={getDueCategoryOptions()}
              />
            </Form.Item>

            <Form.Item
              name="date"
              label="Fecha"
              rules={[{ required: true }, { type: 'date' }]}
            >
              <DatePicker
                picker={
                  category === DueCategoryEnum.Membership ? 'month' : 'date'
                }
                disabled={isFormDisabled()}
                format={
                  category === DueCategoryEnum.Membership
                    ? DateFormatEnum.MMMM_YYYY
                    : DateFormatEnum.DDMMYYYY
                }
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              label="Importe"
              name="amount"
              rules={[{ required: true }, { min: 1, type: 'number' }]}
            >
              <InputNumber
                disabled={isFormDisabled()}
                className="w-40"
                prefix={ARS.code}
                precision={0}
                decimalSeparator=","
                step={100}
              />
            </Form.Item>

            <Form.Item
              label="Notas"
              rules={[{ whitespace: true }]}
              name="notes"
            >
              <Input.TextArea disabled={isFormDisabled()} rows={1} />
            </Form.Item>

            <FormButtons
              scope={ScopeEnum.Movements}
              isLoading={createDue.isLoading || updateDue.isLoading}
              isSaveDisabled={
                createDue.isLoading || updateDue.isLoading || isFormDisabled()
              }
              isBackDisabled={createDue.isLoading || updateDue.isLoading}
              isDeleteDisabled={createDue.isLoading || updateDue.isLoading}
              showDeleteButton={due?.isPending}
              onClickDelete={() => due && deleteDue.mutate({ id: due._id })}
            />
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
