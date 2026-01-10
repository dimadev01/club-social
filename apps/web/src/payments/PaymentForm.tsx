import type { MemberSearchResultDto } from '@club-social/shared/members';

import {
  DueCategory,
  DueCategoryLabel,
  DueSettlementStatus,
  type PendingDueDto,
} from '@club-social/shared/dues';
import { DateFormat, DateFormats, NumberFormat } from '@club-social/shared/lib';
import { useQueries } from '@tanstack/react-query';
import {
  Checkbox,
  DatePicker,
  Empty,
  type FormInstance,
  Input,
  InputNumber,
  Skeleton,
} from 'antd';
import dayjs from 'dayjs';
import { difference, differenceBy, flatMap, orderBy } from 'es-toolkit/array';
import { flow } from 'es-toolkit/function';
import { sumBy } from 'es-toolkit/math';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { getDueQueryOptions } from '@/dues/useDue';
import { usePendingDues } from '@/dues/usePendingDues';
import { useMemberBalance } from '@/member-ledger/useMemberBalance';
import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMemberById } from '@/members/useMemberById';
import { Card, Descriptions, Form, Table, TABLE_COLUMN_WIDTHS } from '@/ui';

export type FormInitialValues = Partial<PaymentFormSchema>;

export interface PaymentFormSchema {
  date: dayjs.Dayjs;
  dues: FormDueToPaySchema[];
  memberId: string;
  notes: string;
  receiptNumber: string;
  surplusToCreditAmount?: number;
  useSurplusToCredit?: boolean;
}

interface FormDueToPaySchema {
  balanceAmount?: number;
  cashAmount?: number;
  dueId: string;
  useBalance: boolean;
}

interface PaymentFormProps {
  disabled?: boolean;
  initialValues?: FormInitialValues;
  mode: 'create' | 'edit';
  onSubmit: (
    data: PaymentFormSchema,
    form: FormInstance<PaymentFormSchema>,
  ) => void;
}

const calculateSelectedDues = flow(
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
  (arr) => orderBy(arr, ['dueId'], ['asc']),
);

export function PaymentForm({
  disabled = false,
  initialValues,
  onSubmit,
}: PaymentFormProps) {
  /**
   * Form
   */
  const [form] = Form.useForm<PaymentFormSchema>();
  const { getFieldValue, setFieldValue } = form;

  const formMemberId = Form.useWatch('memberId', form);
  const formUseSurplusToCredit = Form.useWatch('useSurplusToCredit', form);
  const formDuesRaw = Form.useWatch<FormDueToPaySchema[]>('dues', form);
  const formDues = useMemo(() => formDuesRaw ?? [], [formDuesRaw]);

  const selectedDueIds = useMemo(
    () => formDues.map((due) => due.dueId),
    [formDues],
  );

  /**
   * Queries
   */
  const { data: member, isLoading: isMemberLoading } = useMemberById(
    initialValues?.memberId,
  );
  const { data: pendingDues, isLoading: isPendingDuesLoading } =
    usePendingDues(formMemberId);

  const { data: memberBalance, isLoading: isMemberBalanceLoading } =
    useMemberBalance(formMemberId);

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

  /**
   * Calculations
   */
  const allocatedBalance = useMemo(
    () =>
      sumBy(formDues, (due) => NumberFormat.toCents(due.balanceAmount ?? 0)),
    [formDues],
  );

  const availableBalance = (memberBalance ?? 0) - allocatedBalance;

  /**
   * Due calculations
   */
  const getPaidAmountForDue = useCallback(
    (dueId: string) => {
      const dueSettlements = flatMap(dues, (due) =>
        due.settlements.filter(
          (ds) => ds.status === DueSettlementStatus.APPLIED,
        ),
      );
      const dueSettlementsForDue = dueSettlements.filter(
        (ds) => ds.dueId === dueId,
      );

      return sumBy(dueSettlementsForDue, (ds) => ds.amount);
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

  /**
   * Form dynamic handlers/calculations
   */
  const getMaxBalanceForDue = useCallback(
    (fieldIndex: number): number => {
      const dues: FormDueToPaySchema[] = getFieldValue('dues');
      const currentDue = dues[fieldIndex];
      const currentAllocation = NumberFormat.toCents(
        currentDue.balanceAmount ?? 0,
      );
      const dueRemaining = getRemainingAmountForDue(currentDue.dueId);
      const effectiveAvailable = availableBalance + currentAllocation;

      return Math.min(effectiveAvailable, dueRemaining);
    },
    [getFieldValue, availableBalance, getRemainingAmountForDue],
  );

  const getMaxCashForDue = useCallback(
    (fieldIndex: number): number => {
      const dues: FormDueToPaySchema[] = getFieldValue('dues');
      const currentDue = dues[fieldIndex];
      const dueRemaining = getRemainingAmountForDue(currentDue.dueId);
      const balanceAllocated = NumberFormat.toCents(
        currentDue.balanceAmount ?? 0,
      );

      return dueRemaining - balanceAllocated;
    },
    [getFieldValue, getRemainingAmountForDue],
  );

  const isBalanceCheckboxDisabled = useCallback(
    (fieldIndex: number): boolean => {
      const dues: FormDueToPaySchema[] = getFieldValue('dues');
      const currentDue = dues[fieldIndex];

      if (currentDue.useBalance) {
        return false;
      }

      return availableBalance <= 0;
    },
    [getFieldValue, availableBalance],
  );

  const handleUseBalanceChange = useCallback(
    (fieldIndex: number, checked: boolean) => {
      const dues: FormDueToPaySchema[] = getFieldValue('dues');
      const currentDue = dues[fieldIndex];
      const dueRemaining = getRemainingAmountForDue(currentDue.dueId);

      if (checked) {
        const maxBalance = getMaxBalanceForDue(fieldIndex);
        const balanceToApply = NumberFormat.fromCents(maxBalance);
        const cashAmount = NumberFormat.fromCents(dueRemaining - maxBalance);

        setFieldValue(['dues', fieldIndex, 'balanceAmount'], balanceToApply);
        setFieldValue(['dues', fieldIndex, 'cashAmount'], cashAmount);
      } else {
        setFieldValue(['dues', fieldIndex, 'balanceAmount'], undefined);
        setFieldValue(
          ['dues', fieldIndex, 'cashAmount'],
          NumberFormat.fromCents(dueRemaining),
        );
      }

      setFieldValue(['dues', fieldIndex, 'useBalance'], checked);
    },
    [
      getFieldValue,
      setFieldValue,
      getRemainingAmountForDue,
      getMaxBalanceForDue,
    ],
  );

  const handleBalanceAmountChange = useCallback(
    (fieldIndex: number, value: null | number) => {
      const dues: FormDueToPaySchema[] = getFieldValue('dues');
      const currentDue = dues[fieldIndex];
      const dueRemaining = getRemainingAmountForDue(currentDue.dueId);
      const dueRemainingDisplay = NumberFormat.fromCents(dueRemaining);

      const balanceAmount = value ?? 0;
      const cashAmount = Math.max(0, dueRemainingDisplay - balanceAmount);

      setFieldValue(['dues', fieldIndex, 'cashAmount'], cashAmount);
    },
    [getFieldValue, setFieldValue, getRemainingAmountForDue],
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
          balanceAmount: undefined,
          cashAmount: NumberFormat.fromCents(getRemainingAmountForDue(dueId)),
          dueId,
          useBalance: false,
        });
      });

      // Remove deselected dues
      deselected.forEach((dueId) => {
        paymentDuesToRemove.push({
          cashAmount: NumberFormat.fromCents(getRemainingAmountForDue(dueId)),
          dueId,
          useBalance: false,
        });
      });

      const selectedDues = calculateSelectedDues(
        currentPaymentDues,
        newPaymentDuesToAdd,
        paymentDuesToRemove,
      );

      setFieldValue('dues', selectedDues);
    },
    [getFieldValue, setFieldValue, getRemainingAmountForDue],
  );

  const additionalOptions: MemberSearchResultDto[] = member
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
      onFinish={(values) => onSubmit(values, form)}
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

      {formMemberId && (
        <Descriptions
          bordered={false}
          className="mb-6"
          colon={false}
          layout="vertical"
        >
          <Descriptions.Item label="Saldo del socio">
            {isMemberBalanceLoading ? (
              <Skeleton.Button active />
            ) : (
              NumberFormat.currencyCents(memberBalance ?? 0)
            )}
          </Descriptions.Item>
        </Descriptions>
      )}

      {pendingDues && (
        <>
          <Table
            className="mb-6"
            columns={[
              {
                dataIndex: 'date',
                defaultSortOrder: 'descend',
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
                    return `${DueCategoryLabel[category]} (${DateFormat.monthNameShort(record.date)})`;
                  }

                  return DueCategoryLabel[category];
                },
                title: 'Categoría',
                width: TABLE_COLUMN_WIDTHS.DUE_CATEGORY + 50,
              },
              {
                align: 'right',
                dataIndex: 'amount',
                render: (amount: number) => NumberFormat.currencyCents(amount),
                title: 'Monto',
                width: TABLE_COLUMN_WIDTHS.AMOUNT,
              },
              {
                align: 'right',
                render: (_, record: PendingDueDto) => {
                  return NumberFormat.currencyCents(
                    getPaidAmountForDue(record.id),
                  );
                },
                title: 'Pagado',
                width: TABLE_COLUMN_WIDTHS.AMOUNT,
              },
              {
                align: 'right',
                render: (_, record: PendingDueDto) => {
                  return NumberFormat.currencyCents(
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
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell align="right" colSpan={5} index={0}>
                    Total
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right" colSpan={1} index={1}>
                    {NumberFormat.currencyCents(
                      sumBy(pendingDues, (due) =>
                        getRemainingAmountForDue(due.id),
                      ),
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          <Form.List name="dues">
            {(fields) => {
              const totalCash = sumBy(
                fields,
                (field) =>
                  form.getFieldValue(['dues', field.name, 'cashAmount']) ?? 0,
              );
              const totalBalance = sumBy(
                fields,
                (field) =>
                  form.getFieldValue(['dues', field.name, 'balanceAmount']) ??
                  0,
              );

              return (
                <Card
                  className="mb-6"
                  extra={`Efectivo: ${NumberFormat.currency(totalCash)} | Balance: ${NumberFormat.currency(totalBalance)} | Total: ${NumberFormat.currency(totalCash + totalBalance)}`}
                  size="small"
                  title="Deudas seleccionadas"
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

                    const pendingDue = pendingDues?.find(
                      (d) => d.id === formDue?.dueId,
                    );

                    if (!pendingDue) {
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

                        <Descriptions
                          className="mb-6"
                          items={[
                            {
                              children: DateFormat.date(pendingDue.date),
                              label: 'Fecha',
                            },
                            {
                              children: DueCategoryLabel[pendingDue.category],
                              label: 'Categoría',
                            },
                            {
                              children: NumberFormat.currencyCents(
                                getRemainingAmountForDue(pendingDue.id),
                              ),
                              label: 'Monto a pagar',
                            },
                          ]}
                        />

                        <Form.Item
                          label="Monto a registrar"
                          name={[field.name, 'cashAmount']}
                          rules={[
                            {
                              message: 'El monto debe ser mayor a 0',
                              min: 0,
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
                              getMaxCashForDue(field.name),
                            )}
                            min={0}
                            parser={(value) =>
                              NumberFormat.parse(String(value))
                            }
                            precision={0}
                            step={1000}
                          />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, 'useBalance']}
                          valuePropName="checked"
                        >
                          <Checkbox
                            disabled={
                              isBalanceCheckboxDisabled(field.name) ||
                              (memberBalance ?? 0) <= 0
                            }
                            onChange={(e) =>
                              handleUseBalanceChange(
                                field.name,
                                e.target.checked,
                              )
                            }
                          >
                            Usar saldo disponible
                          </Checkbox>
                        </Form.Item>

                        {formDue?.useBalance && (
                          <Form.Item
                            className="mt-4"
                            label="Monto desde saldo"
                            name={[field.name, 'balanceAmount']}
                            rules={[
                              {
                                message: 'El monto debe ser mayor a 0',
                                min: 0,
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
                                getMaxBalanceForDue(field.name),
                              )}
                              min={0}
                              onChange={(value) =>
                                handleBalanceAmountChange(field.name, value)
                              }
                              parser={(value) =>
                                NumberFormat.parse(String(value))
                              }
                              precision={0}
                              step={1000}
                            />
                          </Form.Item>
                        )}
                      </Card.Grid>
                    );
                  })}
                </Card>
              );
            }}
          </Form.List>

          {formMemberId && (
            <Descriptions
              bordered={false}
              className="mb-6"
              colon={false}
              layout="vertical"
            >
              <Descriptions.Item label="Saldo restante">
                {isMemberBalanceLoading ? (
                  <Skeleton.Button active />
                ) : (
                  NumberFormat.currencyCents(availableBalance)
                )}
              </Descriptions.Item>
            </Descriptions>
          )}

          <Form.Item<PaymentFormSchema>
            name="useSurplusToCredit"
            valuePropName="checked"
          >
            <Checkbox>Agregar saldo a favor</Checkbox>
          </Form.Item>

          {formUseSurplusToCredit && (
            <Form.Item<PaymentFormSchema>
              label="Monto a agregar a favor"
              name="surplusToCreditAmount"
            >
              <InputNumber<number>
                className="w-full"
                formatter={(value) => NumberFormat.format(Number(value))}
                parser={(value) => NumberFormat.parse(String(value))}
                precision={0}
                step={1000}
              />
            </Form.Item>
          )}
        </>
      )}
    </Form>
  );
}
