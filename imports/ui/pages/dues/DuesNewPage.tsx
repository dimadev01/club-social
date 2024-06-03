import { ARS } from '@dinero.js/currencies';
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
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

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
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { MembersSelect } from '@ui/components/Members/MembersSelect';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCreateDue } from '@ui/hooks/dues/useCreateDue';
import { useDue } from '@ui/hooks/dues/useDue';
import { useMembers } from '@ui/hooks/members/useMembers';

type FormValues = {
  amount: number;
  category: DueCategoryEnum;
  date: Dayjs;
  memberIds: string | string[] | undefined;
  notes: string | undefined;
};

export const DuesNewPage = () => {
  const [form] = Form.useForm<FormValues>();

  const category = useWatch(['category'], form);

  const { id } = useParams<{ id?: string }>();

  const { message } = App.useApp();

  const { data: due, fetchStatus: dueFetchStatus } = useDue(
    id ? { id } : undefined,
  );

  const createDue = useCreateDue();

  const { data: members } = useMembers();

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    let date: string;

    if (values.category === DueCategoryEnum.MEMBERSHIP) {
      date = values.date.startOf('month').format(DateFormatEnum.DATE);
    } else {
      date = values.date.startOf('day').format(DateFormatEnum.DATE);
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
        },
      );
    }
  };

  const isLoading = dueFetchStatus === 'fetching';

  if (id && !due && !isLoading) {
    return <NotFound />;
  }

  const isFormDisabled = () => {
    if (!Roles.userIsInRole(user, PermissionEnum.CREATE, ScopeEnum.DUES)) {
      return false;
    }

    if (!Roles.userIsInRole(user, PermissionEnum.UPDATE, ScopeEnum.DUES)) {
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

      {category === DueCategoryEnum.MEMBERSHIP && (
        <Space className="my-1 flex justify-center">
          <Button
            htmlType="button"
            size="small"
            onClick={() => {
              form.setFieldValue(
                'memberIds',
                members
                  ?.filter(
                    (member) =>
                      member.category === MemberCategoryEnum.MEMBER &&
                      member.status === MemberStatusEnum.ACTIVE,
                  )
                  .map((member) => member.id) ?? [],
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
                      member.category === MemberCategoryEnum.CADET &&
                      member.status === MemberStatusEnum.ACTIVE,
                  )
                  .map((member) => member.id) ?? [],
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
   * Component
   */
  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.Dues}>Cobros</Link> },
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
              category: due?.category ?? DueCategoryEnum.ELECTRICITY,
              date: due?.date
                ? DateUtils.utc(due.date, DateFormatEnum.DDMMYYYY)
                : undefined,
              memberIds: due?.memberId ?? [],
              notes: due?.notes,
            }}
          >
            <Form.Item
              label="Socio/s"
              name="memberIds"
              rules={getRulesForMemberIds()}
            >
              <MembersSelect
                dropdownRender={renderMemberDropdown}
                mode={due ? undefined : 'multiple'}
                disabled={isFormDisabled()}
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
                    if (value === DueCategoryEnum.MEMBERSHIP) {
                      form.setFieldValue(
                        'date',
                        DateUtils.utc(
                          due.date,
                          DateFormatEnum.DDMMYYYY,
                        ).startOf('month'),
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
                  category === DueCategoryEnum.MEMBERSHIP ? 'month' : 'date'
                }
                disabled={isFormDisabled()}
                format={
                  category === DueCategoryEnum.MEMBERSHIP
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

            <FormButtons scope={ScopeEnum.MOVEMENTS} />
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
