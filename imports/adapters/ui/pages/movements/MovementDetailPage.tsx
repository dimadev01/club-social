import { ARS } from '@dinero.js/currencies';
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
import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { FormButtons } from '@adapters/ui/components/Form/FormButtons';
import { NotFound } from '@adapters/ui/components/NotFound';
import { Select } from '@adapters/ui/components/Select';
import { useCreateMovement } from '@adapters/ui/hooks/movements/useCreateMovement';
import { useMovement } from '@adapters/ui/hooks/movements/useMovement';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryTypeEnum,
  getCategoryOptions,
  getCategoryTypeOptions,
} from '@domain/categories/category.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';

type FormValues = {
  amount: number;
  category: CategoryEnum;
  date: Dayjs;
  employeeId: string | undefined;
  memberId: string | undefined;
  memberIds: string[] | undefined;
  notes: string;
  professorId: string | undefined;
  serviceId: string | undefined;
  type: CategoryTypeEnum;
};

export const MovementDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const formCategoryType = useWatch(['type'], form);

  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { message } = App.useApp();

  const { data: movement, fetchStatus: movementFetchStatus } = useMovement(id);

  const createMovement = useCreateMovement();

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    if (!movement) {
      await createMovement.mutateAsync(
        {
          amount: MoneyUtils.toCents(values.amount),
          category: values.category,
          date: DateUtils.format(values.date, DateFormatEnum.DATE),
          employeeId: values.employeeId ?? null,
          memberIds: values.memberIds ?? null,
          notes: values.notes,
          professorId: values.professorId ?? null,
          serviceId: values.serviceId ?? null,
          type: values.type,
        },
        {
          onSuccess: () => {
            message.success('Movimiento creado');

            navigate(-1);
          },
        },
      );
    }
  };

  const isLoading = movementFetchStatus === 'fetching';

  if (id && !movement && !isLoading) {
    return <NotFound />;
  }

  /**
   * Component
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
            title: <Link to={AppUrl.Movements}>Movimientos</Link>,
          },
          {
            title: movement
              ? `${movement.date} - ${CategoryLabel[movement.category]} - ${
                  movement.amountFormatted
                }`
              : 'Nuevo Movimiento',
          },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <Card>
          <Form<FormValues>
            layout="vertical"
            disabled={!!movement}
            form={form}
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              amount: movement ? MoneyUtils.fromCents(movement.amount) : 0,
              category: movement?.category,
              date: movement?.date
                ? DateUtils.utc(movement.date, DateFormatEnum.DDMMYYYY)
                : undefined,
              employeeId: movement?.employeeId,
              memberId: movement?.memberId,
              memberIds: undefined,
              notes: movement?.notes,
              professorId: movement?.professorId,
              serviceId: movement?.serviceId,
              type: movement?.type ?? CategoryTypeEnum.Income,
            }}
          >
            <Form.Item
              name="date"
              label="Fecha"
              rules={[{ required: true }, { type: 'date' }]}
            >
              <DatePicker
                format={DateFormatEnum.DDMMYYYY}
                className="w-full"
                disabledDate={(current) => current.isAfter(dayjs())}
              />
            </Form.Item>

            <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
              <Select
                onChange={() => {
                  form.setFieldValue('category', null);

                  form.setFieldValue('amount', null);
                }}
                options={getCategoryTypeOptions()}
              />
            </Form.Item>

            {formCategoryType && (
              <Form.Item
                label="Categoría"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  options={
                    getCategoryOptions(formCategoryType)?.filter(
                      (categoryByType) =>
                        ![
                          CategoryEnum.GuestIncome,
                          CategoryEnum.MembershipIncome,
                          CategoryEnum.ElectricityIncome,
                        ].includes(categoryByType.value),
                    ) ?? []
                  }
                />
              </Form.Item>
            )}

            <Form.Item
              label="Importe"
              name="amount"
              rules={[{ required: true }, { min: 1, type: 'number' }]}
            >
              <InputNumber
                className="w-32"
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
              <Input.TextArea rows={1} />
            </Form.Item>

            <FormButtons scope={ScopeEnum.MOVEMENTS} />
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
