import { ARS } from '@dinero.js/currencies';
import { Checkbox, Form, Input, InputNumber, Table, Tooltip } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { MoneyUtils } from '@shared/utils/money.utils';
import { NumberUtils } from '@shared/utils/number.utils';
import { AppUrl } from '@ui/app.enum';

type Due = {
  _id: string;
  amount: number;
  category: DueCategoryEnum;
  date: string;
  memberId: string;
  memberName: string;
  membershipMonth: string;
};

type Props = {
  pendingDues: Due[] | undefined;
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
      pendingDues?.reduce((acc, d) => acc + d.amount, 0) ?? 0;

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
            Total: {MoneyUtils.formatCents(totalPending)}
          </Table.Summary.Cell>
          <Table.Summary.Cell align="right" index={4}>
            Total: {MoneyUtils.formatWithCurrency(totalDuesToPay)}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const dueIdFieldName = (index: number) => ['dues', index, 'dueId'];

  const isSelectedFieldName = (index: number) => ['dues', index, 'isSelected'];

  const amountFieldName = (index: number) => ['dues', index, 'amount'];

  return (
    <Table
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
      rowKey="_id"
      summary={tableSummary}
    >
      <Table.Column
        dataIndex="date"
        title="Fecha"
        width={150}
        render={(date: string, due: Due) => {
          const index = pendingDues?.findIndex((d) => d._id === due._id) ?? 0;

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

              <Tooltip title="Ver cobro">
                <NavLink to={`${AppUrl.Dues}/${due._id}`}>{date}</NavLink>
              </Tooltip>
            </>
          );
        }}
      />

      <Table.Column
        dataIndex="category"
        title="Categoría"
        align="center"
        render={(category: DueCategoryEnum, due: Due) =>
          `${DueCategoryLabel[category]} ${
            due.category === DueCategoryEnum.Membership
              ? `(${due.membershipMonth})`
              : ''
          }`
        }
      />

      <Table.Column
        dataIndex="amount"
        width={250}
        title="Monto deudor"
        align="right"
        render={(amount: number) => MoneyUtils.formatCents(amount)}
      />

      <Table.Column
        title="Monto a registrar"
        align="right"
        width={250}
        render={(_, due: Due) => {
          const index = pendingDues?.findIndex((d) => d._id === due._id) ?? 0;

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
                  message: 'El mínimo es ARS 1',
                  min: 1,
                  type: 'number',
                },
              ]}
            >
              <InputNumber
                disabled={!isSelected}
                className="w-32"
                prefix={ARS.code}
                precision={0}
                decimalSeparator=","
                step={1000}
                parser={(value) =>
                  NumberUtils.parseFromInputNumber(value ?? '')
                }
                formatter={(value) => NumberUtils.format(value ?? 0)}
                min={0}
              />
            </Form.Item>
          );
        }}
      />
    </Table>
  );
};
