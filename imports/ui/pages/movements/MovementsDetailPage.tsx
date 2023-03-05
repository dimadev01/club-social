import React from 'react';
import {
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { NavLink, useParams } from 'react-router-dom';
import { ARS } from '@dinero.js/currencies';
import {
  CategoryEnum,
  CategoryLabel,
  getCategoryOptions,
} from '@domain/categories/categories.enum';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useCreateMovement } from '@ui/hooks/movements/useCreateMovement';
import { useMovement } from '@ui/hooks/movements/useMovement';
import { useUpdateMovement } from '@ui/hooks/movements/useUpdateMovement';

type FormValues = {
  amount: number;
  category: CategoryEnum;
  date: Dayjs;
  memberIds: string[];
  notes: string;
};

export const MovementsDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const category = useWatch(['category'], form);

  const amount = useWatch(['amount'], form);

  const { id } = useParams<{ id?: string }>();

  const { data: movement, fetchStatus: movementFetchStatus } = useMovement(id);

  const createMovement = useCreateMovement();

  const updateMovement = useUpdateMovement();

  const { data: members, isLoading: membersLoading } = useMembers();

  const handleSubmit = async (values: FormValues) => {
    if (!movement) {
      await createMovement.mutateAsync({
        amount: CurrencyUtils.toCents(values.amount),
        category: values.category,
        date: DateUtils.format(values.date),
        memberIds: values.memberIds,
        notes: values.notes,
      });

      message.success('Movimiento creado');

      // navigate(`${AppUrl.Movements}/${memberId}`);

      form.resetFields();
    } else {
      await updateMovement.mutateAsync({
        amount: CurrencyUtils.toCents(values.amount),
        category: values.category,
        date: DateUtils.format(values.date),
        id: movement._id,
        memberIds: values.memberIds,
        notes: values.notes,
      });

      message.success('Movimiento actualizado');
    }
  };

  if (movementFetchStatus === 'fetching') {
    return <Spin spinning />;
  }

  if (id && !movement) {
    return <NotFound />;
  }

  const renderAmountHelp = () => {
    if (amount > 0) {
      return 'Ingreso';
    }

    if (amount < 0) {
      return 'Egreso';
    }

    return '';
  };

  const getAmountClassNameHelp = () => {
    if (amount > 0) {
      return 'w-40 text-green-500';
    }

    if (amount < 0) {
      return 'w-40 text-red-500';
    }

    return 'w-40 ';
  };

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to={AppUrl.Movements}>Movimientos</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {!!movement &&
            `${movement.date} - ${CategoryLabel[movement.category]} - ${
              movement.amountFormatted
            }`}
          {!movement && 'Nuevo Movimiento'}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            amount: movement
              ? CurrencyUtils.fromCents(movement.amount)
              : undefined,
            category: movement?.category ?? CategoryEnum.Membership,
            date: movement?.date
              ? dayjs(movement.date, DateFormats.DD_MM_YYYY)
              : dayjs(),
            notes: movement?.notes,
          }}
        >
          <Form.Item
            name="date"
            label="Fecha"
            rules={[{ required: true }, { type: 'date' }]}
          >
            <DatePicker format={DateFormats.DD_MM_YYYY} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Categoría"
            name="category"
            rules={[{ required: true }]}
          >
            <Select options={getCategoryOptions()} />
          </Form.Item>

          {category === CategoryEnum.Membership && (
            <Form.Item
              label="Socio"
              name="memberIds"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                loading={membersLoading}
                options={members?.map((member) => ({
                  label: member.name,
                  value: member._id,
                }))}
              />
            </Form.Item>
          )}

          <Form.Item
            label="Importe"
            name="amount"
            rules={[{ required: true }, { type: 'number' }]}
            status="error"
            help={renderAmountHelp()}
          >
            <InputNumber
              className={getAmountClassNameHelp()}
              prefix={ARS.code}
              precision={2}
              decimalSeparator=","
              step={100}
            />
          </Form.Item>

          <Form.Item label="Notas" rules={[{ whitespace: true }]} name="notes">
            <Input.TextArea />
          </Form.Item>

          <ButtonGroup>
            <FormSaveButton
              loading={createMovement.isLoading || updateMovement.isLoading}
              disabled={createMovement.isLoading || updateMovement.isLoading}
            />

            <FormBackButton
              disabled={createMovement.isLoading || updateMovement.isLoading}
              to={AppUrl.Movements}
            />
          </ButtonGroup>
        </Form>
      </Card>
    </>
  );
};
