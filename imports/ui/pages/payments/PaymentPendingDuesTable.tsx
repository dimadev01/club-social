import { Checkbox, Form, Input, Table } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import React from 'react';

import { DueDto } from '@application/dues/dtos/due.dto';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, formatDueCategoryLabel } from '@domain/dues/due.enum';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';

type Props = {
  availableCredit: number;
  pendingDues?: DueDto[];
};

type FormDueValue = {
  creditAmount?: number;
  directAmount: number;
  dueId: string;
  isSelected: boolean;
};

type FormValues = {
  dues: FormDueValue[];
};

export const PaymentPendingDuesTable: React.FC<Props> = ({
  pendingDues,
  availableCredit,
}) => {
  const form = Form.useFormInstance<FormValues>();

  const formDues: FormDueValue[] | undefined = useWatch('dues', {
    form,
    preserve: true,
  });

  const selectedPendingDuesFromForm =
    formDues?.filter((d) => d.isSelected) ?? [];

  const totalCreditAmount = selectedPendingDuesFromForm.reduce(
    (acc, d) => acc + (d.creditAmount ?? 0),
    0,
  );

  const totalDirectAmount = selectedPendingDuesFromForm.reduce(
    (acc, d) => acc + d.directAmount,
    0,
  );

  const renderTableSummary = () => {
    const totalPendingAmount =
      pendingDues?.reduce((acc, d) => acc + d.totalPendingAmount, 0) ?? 0;

    const totalAmount = totalDirectAmount + totalCreditAmount;

    return (
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} />
          <Table.Summary.Cell index={1} />
          <Table.Summary.Cell index={2} />
          <Table.Summary.Cell align="right" index={3}>
            Total Pendiente:{' '}
            {Money.from({ amount: totalPendingAmount }).formatWithCurrency()}
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right" index={4}>
            Total a Registrar:{' '}
            {Money.fromNumber(totalDirectAmount).formatWithCurrency()}
          </Table.Summary.Cell>
          {availableCredit > 0 && (
            <>
              <Table.Summary.Cell align="right" index={5}>
                Total Crédito:{' '}
                {Money.fromNumber(totalCreditAmount).formatWithCurrency()}
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" index={6}>
                Total: {Money.fromNumber(totalAmount).formatWithCurrency()}
              </Table.Summary.Cell>
            </>
          )}
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  /**
   * Field names
   */
  const dueIdFieldName = (index: number) => ['dues', index, 'dueId'];

  const isSelectedFieldName = (index: number) =>
    ['dues', index, 'isSelected'] as
      | ['dues']
      | ['dues', number]
      | ['dues', number, 'creditAmount']
      | ['dues', number, 'directAmount']
      | ['dues', number, 'dueId']
      | ['dues', number, 'isSelected'];

  const directAmountFieldName = (index: number) =>
    ['dues', index, 'directAmount'] as
      | ['dues']
      | ['dues', number]
      | ['dues', number, 'creditAmount']
      | ['dues', number, 'directAmount']
      | ['dues', number, 'dueId']
      | ['dues', number, 'isSelected'];

  const creditAmountFieldName = (index: number) =>
    ['dues', index, 'creditAmount'] as
      | ['dues']
      | ['dues', number]
      | ['dues', number, 'creditAmount']
      | ['dues', number, 'directAmount']
      | ['dues', number, 'dueId']
      | ['dues', number, 'isSelected'];

  const availableCreditAmountAfterSelectedDues =
    availableCredit - totalCreditAmount;

  return (
    <Table<DueDto>
      scroll={{ x: true }}
      rowSelection={{
        onChange: (rowKeys) => {
          form.setFieldsValue({
            dues: formDues.map((d) => ({
              ...d,
              isSelected: rowKeys.includes(d.dueId),
            })),
          });
        },
        selectedRowKeys:
          formDues?.filter((d) => d.isSelected).map((d) => d.dueId) ?? [],
        type: 'checkbox',
      }}
      className="mb-4"
      dataSource={pendingDues ?? []}
      pagination={false}
      size="small"
      bordered
      rowKey="id"
      summary={renderTableSummary}
    >
      <Table.Column
        dataIndex="date"
        title="Fecha"
        width={150}
        render={(date: string, due: DueDto) => {
          const index = pendingDues?.findIndex((d) => d.id === due.id) ?? 0;

          return (
            <>
              <Form.Item hidden name={dueIdFieldName(index)}>
                <Input />
              </Form.Item>

              <Form.Item
                valuePropName="checked"
                hidden
                name={isSelectedFieldName(index)}
              >
                <Checkbox />
              </Form.Item>

              {new DateVo(date).format()}
            </>
          );
        }}
      />

      <Table.Column<DueDto>
        dataIndex="category"
        title="Categoría"
        render={(category: DueCategoryEnum, due: DueDto) =>
          formatDueCategoryLabel(category, due.date)
        }
        align="center"
      />

      <Table.Column
        dataIndex="totalPendingAmount"
        width={250}
        title="Monto a Pagar"
        align="right"
        render={(totalPendingAmount: number) =>
          Money.from({ amount: totalPendingAmount }).formatWithCurrency()
        }
      />

      <Table.Column
        title="Monto a Registrar"
        align="right"
        width={250}
        render={(_, due: DueDto) => {
          const index = pendingDues?.findIndex((d) => d.id === due.id) ?? 0;

          const isSelected = form.getFieldValue(isSelectedFieldName(index));

          return (
            <Form.Item
              name={directAmountFieldName(index)}
              className="mb-0"
              rules={[
                {
                  message: 'Por favor ingrese monto a registrar',
                  required: true,
                },
                {
                  min: 0,
                  type: 'number',
                },
              ]}
            >
              <FormInputAmount
                min={0}
                className="w-32"
                disabled={!isSelected}
              />
            </Form.Item>
          );
        }}
      />

      {availableCredit > 0 && (
        <>
          <Table.Column
            title="Monto de Crédito"
            align="right"
            width={250}
            render={(_, due: DueDto) => {
              const { totalPendingAmount } = due;

              const index = pendingDues?.findIndex((d) => d.id === due.id) ?? 0;

              const isSelected = form.getFieldValue(isSelectedFieldName(index));

              const directAmount = form.getFieldValue(
                directAmountFieldName(index),
              );

              const creditAmount = form.getFieldValue(
                creditAmountFieldName(index),
              );

              const maxByCreditUsage =
                availableCreditAmountAfterSelectedDues + creditAmount;

              const maxByDebitUsage =
                Money.from({ amount: totalPendingAmount }).toNumber() -
                directAmount;

              let max = 0;

              if (maxByCreditUsage < maxByDebitUsage) {
                max = maxByCreditUsage;
              } else if (maxByDebitUsage > 0) {
                max = maxByDebitUsage;
              }

              return (
                <Form.Item
                  name={creditAmountFieldName(index)}
                  className="mb-0"
                  rules={[
                    {
                      message: 'Por favor ingrese monto a registrar',
                      required: true,
                    },
                    {
                      min: 0,
                      type: 'number',
                    },
                  ]}
                >
                  <FormInputAmount
                    max={max}
                    min={0}
                    className="w-32"
                    disabled={!isSelected}
                  />
                </Form.Item>
              );
            }}
          />

          <Table.Column
            title="Monto Total"
            align="right"
            width={250}
            render={(_, due: DueDto) => {
              const index = pendingDues?.findIndex((d) => d.id === due.id) ?? 0;

              const isSelected = form.getFieldValue(isSelectedFieldName(index));

              const directAmount = form.getFieldValue(
                directAmountFieldName(index),
              );

              const creditAmount = form.getFieldValue(
                creditAmountFieldName(index),
              );

              return (
                <Form.Item className="mb-0">
                  <FormInputAmount
                    variant="borderless"
                    value={directAmount + creditAmount}
                    readOnly
                    className="text-right"
                    disabled={!isSelected}
                  />
                </Form.Item>
              );
            }}
          />
        </>
      )}
    </Table>
  );
};
