import type { IMemberSearchResultDto } from '@club-social/shared/members';

import {
  DueCategory,
  DueCategoryLabel,
  type PendingDueDto,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat, DateFormats } from '@club-social/shared/lib';
import { useQueries } from '@tanstack/react-query';
import { DatePicker, Empty, Input, InputNumber, Space } from 'antd';
import dayjs from 'dayjs';
import { difference, differenceBy, flatMap, orderBy } from 'es-toolkit/array';
import { flow } from 'es-toolkit/function';
import { sumBy } from 'es-toolkit/math';
import { useCallback, useState } from 'react';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { getDueQueryOptions } from '@/dues/useDue';
import { usePendingDues } from '@/dues/usePendingDues';
import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMemberById } from '@/members/useMemberById';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { Form } from '@/ui/Form/Form';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';

export type FormInitialValues = Partial<PaymentFormSchema>;

export interface PaymentFormSchema {
  date: dayjs.Dayjs;
  dues: FormDueToPaySchema[];
  memberId: string;
  notes: string;
  receiptNumber: string;
}

interface FormDueToPaySchema {
  amount: number;
  dueId: string;
}

interface PaymentFormProps {
  disabled?: boolean;
  initialValues?: FormInitialValues;
  mode: 'create' | 'edit';
  onSubmit: (data: PaymentFormSchema) => void;
}

const calculateFinalPaymentDues = flow(
  (
    currentFormDues: FormDueToPaySchema[],
    formDuesToAdd: FormDueToPaySchema[],
    formDuesToRemove: FormDueToPaySchema[],
  ) =>
    differenceBy(
      [...currentFormDues, ...formDuesToAdd],
      formDuesToRemove,
      (pd) => pd.dueId,
    ),
  (arr) => orderBy(arr, ['dueId'], ['desc']),
);

export function PaymentForm({
  disabled = false,
  initialValues,
  onSubmit,
}: PaymentFormProps) {
  const [form] = Form.useForm<PaymentFormSchema>();
  const { getFieldValue, setFieldValue } = form;
  const formMemberId = Form.useWatch('memberId', form);

  const { data: member, isLoading: isMemberLoading } = useMemberById(
    initialValues?.memberId,
  );
  const { data: pendingDues, isLoading: isPendingDuesLoading } =
    usePendingDues(formMemberId);

  const { data: dues, isLoading: isLoadingDues } = useQueries({
    combine: (results) => ({
      data: results
        .filter((result) => !!result.data)
        .flatMap((result) => result.data),
      isFetching: results.some((result) => result.isFetching),
      isLoading: results.some((result) => result.isLoading),
    }),
    queries: (pendingDues ?? []).map((due) => getDueQueryOptions(due.id)),
  });

  const [selectedDueIds, setSelectedDueIds] = useState<string[]>([]);

  const getPaidAmountForDue = useCallback(
    (dueId: string) => {
      const dueSettlements = flatMap(dues, (due) => due.settlements);
      const dueSettlementsForDue = dueSettlements.filter(
        (ds) => ds.dueId === dueId,
      );

      return sumBy(dueSettlementsForDue, (p) => p.amount);
    },
    [dues],
  );

  const getRemainingAmountForDue = useCallback(
    (dueId: string) => {
      const due = pendingDues?.find((d) => d.id === dueId);

      if (!due) {
        return 0;
      }

      return due.amount - getPaidAmountForDue(dueId);
    },
    [pendingDues, getPaidAmountForDue],
  );

  const handleRowSelectionChange = useCallback(
    (newSelectedRowKeys: React.Key[]) => {
      const currentPaymentDues: FormDueToPaySchema[] = getFieldValue('dues');
      const currentSelectedRowKeys = currentPaymentDues.map((p) => p.dueId);

      // Find newly selected dues (not in current paymentDues)
      const newSelections = difference(
        newSelectedRowKeys,
        currentSelectedRowKeys,
      ).map(String);

      // Find deselected dues (in current paymentDues but not in newSelectedRowKeys)
      const deselected = difference(
        currentSelectedRowKeys,
        newSelectedRowKeys,
      ).map(String);

      const newPaymentDuesToAdd: FormDueToPaySchema[] = [];
      const paymentDuesToRemove: FormDueToPaySchema[] = [];

      // Add newly selected dues with full amount
      newSelections.forEach((dueId) => {
        newPaymentDuesToAdd.push({
          amount: NumberFormat.fromCents(getRemainingAmountForDue(dueId)),
          dueId,
        });
      });

      // Remove deselected dues
      deselected.forEach((dueId) => {
        paymentDuesToRemove.push({
          amount: NumberFormat.fromCents(getRemainingAmountForDue(dueId)),
          dueId,
        });
      });

      const finalFormPaymentDues = calculateFinalPaymentDues(
        currentPaymentDues,
        newPaymentDuesToAdd,
        paymentDuesToRemove,
      );

      setFieldValue('dues', finalFormPaymentDues);
      setSelectedDueIds(newSelectedRowKeys as string[]);
    },
    [getFieldValue, setFieldValue, getRemainingAmountForDue],
  );

  const additionalOptions: IMemberSearchResultDto[] = member
    ? [
        {
          category: member.category,
          id: member.id,
          name: member.name,
          status: member.status,
        },
      ]
    : [];

  const isLoading = isMemberLoading || isPendingDuesLoading || isLoadingDues;

  return (
    <Form<PaymentFormSchema>
      disabled={disabled || isLoading}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={onSubmit}
    >
      <Form.Item<PaymentFormSchema>
        label="Fecha"
        name="date"
        rules={[{ message: 'La fecha es requerida', required: true }]}
      >
        <DatePicker
          allowClear={false}
          className="w-full"
          format={DateFormats.date}
          picker="date"
        />
      </Form.Item>

      <Form.Item<PaymentFormSchema>
        label="Socio"
        name="memberId"
        rules={[{ message: 'Debe seleccionar un socio', required: true }]}
      >
        <MemberSearchSelect
          additionalOptions={additionalOptions}
          loading={isMemberLoading}
          placeholder="Buscar y seleccionar socio..."
        />
      </Form.Item>

      <Form.Item<PaymentFormSchema>
        label="Número de recibo"
        name="receiptNumber"
      >
        <Input placeholder="Número de recibo (opcional)" />
      </Form.Item>

      <Form.Item<PaymentFormSchema> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={3} />
      </Form.Item>

      {pendingDues && (
        <>
          <Table
            className="mb-6"
            columns={[
              {
                dataIndex: 'date',
                render: (date: string, record: PendingDueDto) => (
                  <Link to={appRoutes.dues.view(record.id)}>
                    {DateFormat.date(date)}
                  </Link>
                ),
                title: 'Fecha',
              },
              {
                align: 'center',
                dataIndex: 'category',
                render: (category: DueCategory, record: PendingDueDto) => {
                  if (category === DueCategory.MEMBERSHIP) {
                    return `${DueCategoryLabel[category]} (${DateFormat.month(record.date)})`;
                  }

                  return DueCategoryLabel[category];
                },
                title: 'Categoría',
                width: TABLE_COLUMN_WIDTHS.CATEGORY + 50,
              },
              {
                align: 'right',
                dataIndex: 'amount',
                render: (amount: number) =>
                  NumberFormat.formatCurrencyCents(amount),
                title: 'Monto',
                width: TABLE_COLUMN_WIDTHS.AMOUNT,
              },
              {
                align: 'right',
                render: (_, record: PendingDueDto) => {
                  return NumberFormat.formatCurrencyCents(
                    getPaidAmountForDue(record.id),
                  );
                },
                title: 'Pagado',
                width: TABLE_COLUMN_WIDTHS.AMOUNT,
              },
              {
                align: 'right',
                render: (_, record: PendingDueDto) => {
                  return NumberFormat.formatCurrencyCents(
                    getRemainingAmountForDue(record.id),
                  );
                },
                title: 'Restante',
                width: TABLE_COLUMN_WIDTHS.AMOUNT,
              },
            ]}
            dataSource={pendingDues}
            pagination={false}
            rowSelection={{
              onChange: handleRowSelectionChange,
              selectedRowKeys: selectedDueIds,
              type: 'checkbox',
            }}
            size="small"
          />

          <Form.List name="dues">
            {(fields) => {
              const total = sumBy(fields, (field) =>
                form.getFieldValue(['dues', field.name, 'amount']),
              );

              return (
                <Card
                  extra={`Total a registrar: ${NumberFormat.formatCurrency(total)}`}
                  size="small"
                  title="Deudas Seleccionadas"
                  type="inner"
                >
                  {fields.length === 0 && (
                    <Empty
                      description="Seleccione deudas de la tabla para registrar pagos"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}

                  {fields.map((field) => {
                    const formDue = form.getFieldValue(['dues', field.name]);

                    const due = pendingDues?.find(
                      (d) => d.id === formDue?.dueId,
                    );

                    if (!due) {
                      return null;
                    }

                    return (
                      <Card.Grid
                        className="w-full md:w-1/2 lg:w-1/3"
                        key={field.key}
                      >
                        <Form.Item hidden name={[field.name, 'dueId']} noStyle>
                          <Input />
                        </Form.Item>
                        <Space className="flex" vertical>
                          <Descriptions
                            items={[
                              {
                                children: DateFormat.date(due.date),
                                label: 'Fecha',
                              },
                              {
                                children: DueCategoryLabel[due.category],
                                label: 'Categoría',
                              },
                              {
                                children: NumberFormat.formatCurrencyCents(
                                  getRemainingAmountForDue(due.id),
                                ),
                                label: 'Monto a pagar',
                              },
                            ]}
                          />

                          <Form.Item
                            label="Monto a registrar"
                            name={[field.name, 'amount']}
                            rules={[
                              {
                                message: 'El monto debe ser mayor a 1',
                                min: 1,
                                type: 'number',
                              },
                            ]}
                          >
                            <InputNumber
                              className="w-full"
                              formatter={(value) =>
                                NumberFormat.format(Number(value))
                              }
                              max={NumberFormat.fromCents(
                                getRemainingAmountForDue(due.id),
                              )}
                              min={0}
                              parser={(value) =>
                                NumberFormat.parse(String(value))
                              }
                              precision={0}
                              step={1000}
                            />
                          </Form.Item>
                        </Space>
                      </Card.Grid>
                    );
                  })}
                </Card>
              );
            }}
          </Form.List>
        </>
      )}
    </Form>
  );
}
