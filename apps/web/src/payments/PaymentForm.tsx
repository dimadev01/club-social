import type { IMemberSearchResultDto } from '@club-social/shared/members';

import {
  DueCategory,
  DueCategoryLabel,
  type IPendingDueDto,
} from '@club-social/shared/dues';
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

import { usePendingDues } from '@/dues/usePendingDues';
import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMemberById } from '@/members/useMemberById';
import { DateFormat, DateFormats } from '@/shared/lib/date-format';
import { NumberFormat } from '@/shared/lib/number-format';
import { Card } from '@/ui/Card';
import { Form } from '@/ui/Form';
import { Table } from '@/ui/Table/Table';

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
    newPaymentDuesToAdd: FormPaymentDueData[],
    paymentDuesToRemove: FormPaymentDueData[],
  ) =>
    differenceBy(
      [...currentPaymentDues, ...newPaymentDuesToAdd],
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

  const [selectedDueIds, setSelectedDueIds] = useState<string[]>([]);

  const [form] = Form.useForm<PaymentFormData>();
  const { getFieldValue, setFieldValue } = form;

  const formMemberId = Form.useWatch('memberId', form);

  const memberQuery = useMemberById(initialValues?.memberId);

  const pendingDuesQuery = usePendingDues(formMemberId);

  const handleRowSelectionChange = useCallback(
    (newSelectedRowKeys: React.Key[]) => {
      const currentPaymentDues: FormPaymentDueData[] =
        getFieldValue('paymentDues');
      const currentSelectedRowKeys = currentPaymentDues.map((p) => p.dueId);
      const pendingDues = pendingDuesQuery.data ?? [];

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
        const due = pendingDues.find((d) => d.id === dueId);

        if (due) {
          newPaymentDuesToAdd.push({
            amount: NumberFormat.fromCents(due.amount),
            dueId,
          });
        }
      });

      // Remove deselected dues
      deselected.forEach((dueId) => {
        const due = pendingDues.find((d) => d.id === dueId);

        if (due) {
          paymentDuesToRemove.push({
            amount: NumberFormat.fromCents(due.amount),
            dueId,
          });
        }
      });

      const finalFormPaymentDues = calculateFinalPaymentDues(
        currentPaymentDues,
        newPaymentDuesToAdd,
        paymentDuesToRemove,
      );

      setFieldValue('paymentDues', finalFormPaymentDues);
      setSelectedDueIds(newSelectedRowKeys as string[]);
    },
    [pendingDuesQuery.data, getFieldValue, setFieldValue],
  );

  const additionalOptions: IMemberSearchResultDto[] = memberQuery.data
    ? [
        {
          id: memberQuery.data.id,
          name: memberQuery.data.name,
          status: memberQuery.data.status,
        },
      ]
    : [];

  return (
    <Form<PaymentFormData>
      disabled={disabled}
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
          loading={memberQuery.isLoading}
          placeholder="Buscar y seleccionar socio..."
        />
      </Form.Item>

      <Form.Item<PaymentFormData> label="Número de recibo" name="receiptNumber">
        <Input placeholder="Número de recibo (opcional)" />
      </Form.Item>

      <Form.Item<PaymentFormData> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={3} />
      </Form.Item>

      {pendingDuesQuery.data && (
        <>
          <Table
            className="mb-6"
            columns={[
              {
                dataIndex: 'date',
                render: (date: string) => DateFormat.date(date),
                title: 'Fecha',
                width: 150,
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
                width: 150,
              },
              {
                align: 'right',
                dataIndex: 'amount',
                render: (amount: number) => NumberFormat.formatCents(amount),
                title: 'Monto',
              },
            ]}
            dataSource={pendingDuesQuery.data}
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
                    const due = pendingDuesQuery.data?.find(
                      (d) => d.id === paymentDue?.dueId,
                    );

                    if (!due) {
                      return null;
                    }

                    const maxAmount = NumberFormat.fromCents(due.amount);

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
                              {NumberFormat.formatCents(due.amount)}
                            </Descriptions.Item>
                          </Descriptions>

                          <Form.Item
                            label="Monto a registrar"
                            name={[field.name, 'amount']}
                            rules={[
                              {
                                message: 'Ingrese el monto a pagar',
                                required: true,
                              },
                            ]}
                          >
                            <InputNumber
                              className="w-full"
                              formatter={(value) =>
                                NumberFormat.format(Number(value))
                              }
                              max={maxAmount}
                              min={1}
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
