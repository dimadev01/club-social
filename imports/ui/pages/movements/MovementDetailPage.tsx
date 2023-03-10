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
import find from 'lodash/find';
import { NavLink, useParams } from 'react-router-dom';
import { ARS } from '@dinero.js/currencies';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryType,
  getCategoryOptions,
  getCategoryTypeOptions,
  MemberCategories,
} from '@domain/categories/categories.enum';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCategories } from '@ui/hooks/categories/useCategories';
import { useEmployees } from '@ui/hooks/employees/useEmployees';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useCreateMovement } from '@ui/hooks/movements/useCreateMovement';
import { useMovement } from '@ui/hooks/movements/useMovement';
import { useUpdateMovement } from '@ui/hooks/movements/useUpdateMovement';
import { useProfessors } from '@ui/hooks/professors/useProfessors';
import { useRentals } from '@ui/hooks/rentals/rentals';

type FormValues = {
  amount: number;
  category: CategoryEnum;
  date: Dayjs;
  memberIds: string[];
  notes: string;
  type: CategoryType;
};

export const MovementDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const category = useWatch(['category'], form);

  const type = useWatch(['type'], form);

  const { id } = useParams<{ id?: string }>();

  const {
    data: movement,
    fetchStatus: movementFetchStatus,
    refetch,
  } = useMovement(id);

  const createMovement = useCreateMovement();

  const updateMovement = useUpdateMovement();

  const { data: members, isLoading: isLoadingMembers } = useMembers(
    MemberCategories.includes(category)
  );

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const { data: professors, isLoading: isLoadingProfessors } = useProfessors(
    category === CategoryEnum.Professor
  );

  const { data: employees, isLoading: isLoadingEmployees } = useEmployees(
    category === CategoryEnum.Employee
  );

  const { data: rentals, isLoading: isLoadingRentals } = useRentals(
    category === CategoryEnum.Rental
  );

  const handleSubmit = async (values: FormValues) => {
    if (!movement) {
      await createMovement.mutateAsync({
        amount: CurrencyUtils.toCents(values.amount),
        category: values.category,
        date: DateUtils.format(values.date),
        memberIds: values.memberIds,
        notes: values.notes,
        type: values.type,
      });

      message.success('Movimiento creado');

      form.resetFields();
    } else {
      await updateMovement.mutateAsync({
        amount: CurrencyUtils.toCents(values.amount),
        category: values.category,
        date: DateUtils.format(values.date),
        id: movement._id,
        memberIds: values.memberIds,
        notes: values.notes,
        type: values.type,
      });

      message.success('Movimiento actualizado');

      refetch();
    }
  };

  if (movementFetchStatus === 'fetching' || isLoadingCategories) {
    return <Spin spinning />;
  }

  if (id && !movement) {
    return <NotFound />;
  }

  const getPriceForCategory = (value: CategoryEnum): number => {
    const foundCategory = find(categories, { code: value });

    return foundCategory?.amount
      ? CurrencyUtils.fromCents(foundCategory.amount)
      : 0;
  };

  const renderDetailsSection = () => {
    if (MemberCategories.includes(category)) {
      return (
        <Form.Item label="Socio" name="memberIds" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            disabled={isLoadingMembers}
            loading={isLoadingMembers}
            options={members?.map((member) => ({
              label: member.name,
              value: member._id,
            }))}
          />
        </Form.Item>
      );
    }

    if (category === CategoryEnum.Professor) {
      return (
        <Form.Item
          label="Profesor"
          name="professorId"
          rules={[{ required: true }]}
        >
          <Select
            disabled={isLoadingProfessors}
            loading={isLoadingProfessors}
            options={professors?.map((professor) => ({
              label: professor.name,
              value: professor._id,
            }))}
          />
        </Form.Item>
      );
    }

    if (category === CategoryEnum.Employee) {
      return (
        <Form.Item
          label="Empleado"
          name="employeeId"
          rules={[{ required: true }]}
        >
          <Select
            disabled={isLoadingEmployees}
            loading={isLoadingEmployees}
            options={employees?.map((employee) => ({
              label: employee.name,
              value: employee._id,
            }))}
          />
        </Form.Item>
      );
    }

    if (category === CategoryEnum.Rental) {
      return (
        <Form.Item
          label="Alquiler"
          name="rentalId"
          rules={[{ required: true }]}
        >
          <Select
            disabled={isLoadingRentals}
            loading={isLoadingRentals}
            options={rentals?.map((rental) => ({
              label: rental.name,
              value: rental._id,
            }))}
          />
        </Form.Item>
      );
    }

    return null;
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
              : getPriceForCategory(CategoryEnum.MembershipIncome),
            category: movement?.category ?? CategoryEnum.MembershipIncome,
            date: movement?.date
              ? dayjs(movement.date, DateFormats.DD_MM_YYYY)
              : dayjs(),
            notes: movement?.notes,
            type: movement?.type ?? CategoryType.Income,
          }}
        >
          <Form.Item
            name="date"
            label="Fecha"
            rules={[{ required: true }, { type: 'date' }]}
          >
            <DatePicker
              format={DateFormats.DD_MM_YYYY}
              className="w-full"
              disabledDate={(current) => current.isAfter(dayjs())}
            />
          </Form.Item>

          <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
            <Select
              onChange={() => {
                form.setFieldValue('category', undefined);

                form.setFieldValue('amount', undefined);
              }}
              options={getCategoryTypeOptions()}
            />
          </Form.Item>

          {type && (
            <Form.Item
              label="Categoría"
              name="category"
              rules={[{ required: true }]}
            >
              <Select
                disabled={isLoadingCategories}
                loading={isLoadingCategories}
                onChange={(value) =>
                  form.setFieldValue('amount', getPriceForCategory(value))
                }
                options={getCategoryOptions(type)}
              />
            </Form.Item>
          )}

          {renderDetailsSection()}

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

          <Form.Item label="Notas" rules={[{ whitespace: true }]} name="notes">
            <Input.TextArea rows={1} />
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
