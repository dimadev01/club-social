import React from 'react';
import { Checkbox, Form, Input, InputNumber, Table } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { NavLink } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { ARS } from '@dinero.js/currencies';

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
            Total: {MoneyUtils.format(totalDuesToPay)}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <Table
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
        render={(date: string, due: Due) => {
          const index = pendingDues?.findIndex((d) => d._id === due._id) ?? 0;

          return (
            <>
              <Form.Item hidden name={['dues', index, 'dueId']}>
                <Input />
              </Form.Item>

              <Form.Item
                valuePropName="checked"
                hidden
                name={['dues', index, 'isSelected']}
              >
                <Checkbox />
              </Form.Item>

              <NavLink to={`${AppUrl.Dues}/${due._id}`}>{date}</NavLink>
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
        title="Monto deudor"
        align="right"
        render={(amount: number) => MoneyUtils.formatCents(amount)}
      />

      <Table.Column
        title="Monto a registrar"
        align="right"
        render={(_, due: Due) => {
          const index = pendingDues?.findIndex((d) => d._id === due._id) ?? 0;

          const name = ['dues', index, 'amount'];

          const isFieldValid = form.getFieldError(name).length === 0;

          const isSelected = form.getFieldValue(['dues', index, 'isSelected']);

          return (
            <Form.Item
              name={name}
              className={isFieldValid ? 'mb-0' : ''}
              rules={[
                {
                  message: 'Requerido',
                  required: true,
                },
                {
                  message: 'Requerido',
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
                step={100}
                min={1}
              />
            </Form.Item>
          );
        }}
      />
    </Table>
  );
};
