import { Checkbox, Form, Input, Table } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import React from 'react';

import { DueDto } from '@application/dues/dtos/due.dto';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, formatDueCategoryLabel } from '@domain/dues/due.enum';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';

type Props = {
  pendingDues?: DueDto[];
};

type FormDueValue = {
  amount: number;
  dueId: string;
  isSelected: boolean;
};

type FormValues = {
  dues: FormDueValue[];
};

export const PaymentPendingDuesTable: React.FC<Props> = ({ pendingDues }) => {
  const form = Form.useFormInstance<FormValues>();

  const formDues: FormDueValue[] | undefined = useWatch('dues', {
    form,
    preserve: true,
  });

  const tableSummary = () => {
    const totalPending =
      pendingDues?.reduce((acc, d) => acc + d.totalPendingAmount, 0) ?? 0;

    const totalDuesToPay =
      formDues
        ?.filter((d) => d.isSelected)
        .reduce((acc, d) => acc + d.amount, 0) ?? 0;

    return (
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} />
          <Table.Summary.Cell index={1} />
          <Table.Summary.Cell index={2} />
          <Table.Summary.Cell align="right" index={3}>
            Total: {new Money({ amount: totalPending }).formatWithCurrency()}
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right" index={4}>
            Total: {Money.fromNumber(totalDuesToPay).formatWithCurrency()}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const dueIdFieldName = (index: number) => ['dues', index, 'dueId'];

  const isSelectedFieldName = (index: number) => ['dues', index, 'isSelected'];

  const amountFieldName = (index: number) => ['dues', index, 'amount'];

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
      summary={tableSummary}
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
        title="Monto pendiente"
        align="right"
        render={(totalPendingAmount: number) =>
          new Money({ amount: totalPendingAmount }).formatWithCurrency()
        }
      />

      <Table.Column
        title="Monto a pagar"
        align="right"
        width={250}
        render={(_, due: DueDto) => {
          const index = pendingDues?.findIndex((d) => d.id === due.id) ?? 0;

          const isSelected = form.getFieldValue(isSelectedFieldName(index));

          return (
            <Form.Item
              name={amountFieldName(index)}
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
              <FormInputAmount className="w-32" disabled={!isSelected} />
            </Form.Item>
          );
        }}
      />
    </Table>
  );
};
