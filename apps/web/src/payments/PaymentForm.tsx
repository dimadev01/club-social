import type { IMemberSearchResultDto } from '@club-social/shared/members';

import {
  DueCategory,
  DueCategoryLabel,
  type IPendingDueDto,
} from '@club-social/shared/dues';
import { useQueries } from '@tanstack/react-query';
import {
  DatePicker,
  Descriptions,
  Empty,
  Grid,
  Input,
  InputNumber,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { difference, differenceBy, orderBy } from 'es-toolkit/array';
import { flow } from 'es-toolkit/function';
import { useCallback, useState } from 'react';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { getPaymentDuesByDueQueryOptions } from '@/dues/usePaymentDuesByDue';
import { usePendingDues } from '@/dues/usePendingDues';
import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMemberById } from '@/members/useMemberById';
import { DateFormat, DateFormats } from '@/shared/lib/date-format';
import { NumberFormat } from '@/shared/lib/number-format';
import { Card } from '@/ui/Card';
import { Form } from '@/ui/Form';
import { Table } from '@/ui/Table/Table';
import { TABLE_COLUMN_WIDTHS } from '@/ui/Table/table-column-widths';

export type FormInitialValues = Partial<PaymentFormData>;

export interface PaymentFormData {
  date: dayjs.Dayjs;
  memberId: string;
  notes: string;
  paymentDues: FormPaymentDueData[];
  receiptNumber: string;
}

interface FormPaymentDueData {
  amount: number;
  dueId: string;
}

interface PaymentFormProps {
  disabled?: boolean;
  initialValues?: FormInitialValues;
  mode: 'create' | 'edit';
  onSubmit: (data: PaymentFormData) => void;
}

const calculateFinalPaymentDues = flow(
  (
    currentPaymentDues: FormPaymentDueData[],
    paymentDuesToAdd: FormPaymentDueData[],
    paymentDuesToRemove: FormPaymentDueData[],
  ) =>
    differenceBy(
      [...currentPaymentDues, ...paymentDuesToAdd],
      paymentDuesToRemove,
      (pd) => pd.dueId,
    ),
  (arr) => orderBy(arr, ['dueId'], ['desc']),
);

export function PaymentForm({
  disabled = false,
  initialValues,
  onSubmit,
}: PaymentFormProps) {
  const { md } = Grid.useBreakpoint();
  const [form] = Form.useForm<PaymentFormData>();
  const { getFieldValue, setFieldValue } = form;
  const formMemberId = Form.useWatch('memberId', form);

  const { data: member, isLoading: isMemberLoading } = useMemberById(
    initialValues?.memberId,
  );
  const { data: pendingDues, isLoading: isPendingDuesLoading } =
    usePendingDues(formMemberId);
  const { data: paymentDues, isLoading: isPaymentDuesLoading } = useQueries({
    combine: (results) => ({
      data: results
        .filter((result) => !!result.data)
        .flatMap((result) => result.data),
      isFetching: results.some((result) => result.isFetching),
      isLoading: results.some((result) => result.isLoading),
    }),
    queries: (pendingDues ?? []).map((due) =>
      getPaymentDuesByDueQueryOptions(due.id),
    ),
  });

  const [selectedDueIds, setSelectedDueIds] = useState<string[]>([]);

  const getPaidAmountForDue = useCallback(
    (dueId: string) => {
      const payments = paymentDues.filter((p) => p.dueId === dueId);

      return payments.reduce((acc, curr) => acc + curr.amount, 0);
    },
    [paymentDues],
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
      const currentPaymentDues: FormPaymentDueData[] =
        getFieldValue('paymentDues');
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

      const newPaymentDuesToAdd: FormPaymentDueData[] = [];
      const paymentDuesToRemove: FormPaymentDueData[] = [];

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

      setFieldValue('paymentDues', finalFormPaymentDues);
      setSelectedDueIds(newSelectedRowKeys as string[]);
    },
    [getFieldValue, setFieldValue, getRemainingAmountForDue],
  );

  const additionalOptions: IMemberSearchResultDto[] = member
    ? [
        {
          id: member.id,
          name: member.name,
          status: member.status,
        },
      ]
    : [];

  const isLoading =
    isMemberLoading || isPendingDuesLoading || isPaymentDuesLoading;

  return (
    <Form<PaymentFormData>
      disabled={disabled || isLoading}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={onSubmit}
    >
      <Form.Item<PaymentFormData>
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

      <Form.Item<PaymentFormData>
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

      <Form.Item<PaymentFormData> label="Número de recibo" name="receiptNumber">
        <Input placeholder="Número de recibo (opcional)" />
      </Form.Item>

      <Form.Item<PaymentFormData> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={3} />
      </Form.Item>

      {pendingDues && (
        <>
          <Table
            className="mb-6"
            columns={[
              {
                dataIndex: 'date',
                render: (date: string, record: IPendingDueDto) => (
                  <Link to={appRoutes.dues.view(record.id)}>
                    {DateFormat.date(date)}
                  </Link>
                ),
                title: 'Fecha',
              },
              {
                align: 'center',
                dataIndex: 'category',
                render: (category: DueCategory, record: IPendingDueDto) => {
                  if (category === DueCategory.MEMBERSHIP) {
                    return `${DueCategoryLabel[category]} (${DateFormat.month(record.date)})`;
                  }

                  return DueCategoryLabel[category];
                },
                title: 'Categoría',
                width: TABLE_COLUMN_WIDTHS.CATEGORY,
              },
              {
                align: 'right',
                dataIndex: 'amount',
                render: (amount: number) => NumberFormat.formatCents(amount),
                title: 'Monto',
                width: TABLE_COLUMN_WIDTHS.AMOUNT,
              },
              {
                align: 'right',
                render: (_, record: IPendingDueDto) => {
                  return NumberFormat.formatCents(
                    getPaidAmountForDue(record.id),
                  );
                },
                title: 'Pagado',
                width: TABLE_COLUMN_WIDTHS.AMOUNT,
              },
              {
                align: 'right',
                render: (_, record: IPendingDueDto) => {
                  return NumberFormat.formatCents(
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

          <Form.List name="paymentDues">
            {(fields) => {
              return (
                <Card size="small" title="Deudas Seleccionadas" type="inner">
                  {fields.length === 0 && (
                    <Empty
                      description="Seleccione deudas de la tabla para registrar pagos"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}

                  {fields.map((field) => {
                    const paymentDue = form.getFieldValue([
                      'paymentDues',
                      field.name,
                    ]);
                    const due = pendingDues?.find(
                      (d) => d.id === paymentDue?.dueId,
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
                        <Space className="flex" size="middle" vertical>
                          <Descriptions
                            bordered
                            column={1}
                            layout={md ? 'horizontal' : 'vertical'}
                            size="small"
                          >
                            <Descriptions.Item label="Fecha">
                              {DateFormat.date(due.date)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Categoría">
                              {DueCategoryLabel[due.category]}
                            </Descriptions.Item>
                            <Descriptions.Item label="Monto a pagar">
                              {NumberFormat.formatCents(
                                getRemainingAmountForDue(due.id),
                              )}
                            </Descriptions.Item>
                          </Descriptions>

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
