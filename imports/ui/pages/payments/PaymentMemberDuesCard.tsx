import React from 'react';
import { Checkbox, Form, Input, InputNumber, Table } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { Dayjs } from 'dayjs';
import { ARS } from '@dinero.js/currencies';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';
import { PendingDueDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-due.dto';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateUtils } from '@shared/utils/date.utils';

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
  dues: Due[] | undefined;
  memberId: string;
};

type FormDueValue = {
  amount: number;
  dueId: string;
  isSelected: boolean;
};

type FormDuesValue = {
  dues: FormDueValue[];
  memberId: string;
  notes: string | null;
};

type FormValues = {
  date: Dayjs;
  dues: FormDuesValue[];
};

export const PaymentMemberDuesCard: React.FC<Props> = ({ memberId, dues }) => {
  const form = Form.useFormInstance<FormValues>();

  const formDues = useWatch('dues', { form, preserve: true });

  if (!formDues) {
    return null;
  }

  if (!dues) {
    return null;
  }

  const pendingDuesByMember = dues.filter((d) => d.memberId === memberId);

  const totalPendingDuesByMember = dues.reduce((acc, d) => acc + d.amount, 0);

  const formDuesByMember = formDues.find((d) => d.memberId === memberId);

  const totalDuesToPay =
    formDuesByMember?.dues.reduce((acc, d) => acc + d.amount, 0) ?? 0;

  const selectedRowKeys = formDuesByMember?.dues
    .filter((d) => d.isSelected)
    .map((d) => d.dueId);

  const tableSummary = () => (
    <Table.Summary>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} />
        <Table.Summary.Cell index={1} />
        <Table.Summary.Cell index={2} />
        <Table.Summary.Cell align="right" index={3}>
          Total: {MoneyUtils.formatCents(totalPendingDuesByMember)}
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={4}>
          Total: {MoneyUtils.format(totalDuesToPay)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );

  const memberIndex = formDuesByMember ? formDues.indexOf(formDuesByMember) : 0;

  return (
    <>
      <Table
        rowSelection={{
          getCheckboxProps: () => ({ disabled: dues.length === 1 }),
          onChange: (rowKeys) => {
            form.setFieldValue(
              ['dues', memberIndex, 'dues'],
              formDuesByMember?.dues.map((d) => ({
                ...d,
                isSelected: rowKeys.includes(d.dueId),
              })) ?? 0
            );
          },
          selectedRowKeys,
          type: 'checkbox',
        }}
        className="mb-4"
        dataSource={pendingDuesByMember}
        pagination={false}
        size="small"
        bordered
        rowKey="_id"
        summary={tableSummary}
        columns={[
          {
            dataIndex: 'date',
            render: (date: string) => DateUtils.formatUtc(date),
            title: 'Fecha',
          },
          {
            align: 'center',
            dataIndex: 'category',
            render: (category: DueCategoryEnum, due: PendingDueDto) =>
              `${DueCategoryLabel[category]} ${
                due.category === DueCategoryEnum.Membership
                  ? `(${due.membershipMonth})`
                  : ''
              }`,
            title: 'Categoría',
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amount: number) => MoneyUtils.formatCents(amount),
            title: 'Monto deudor',
          },
          {
            align: 'right',
            render: (_, due: PendingDueDto) => {
              const dueInForm = formDuesByMember?.dues.find(
                (d) => d.dueId === due._id
              );

              if (!dueInForm) {
                return null;
              }

              const dueIndex = formDuesByMember?.dues.indexOf(dueInForm) ?? 0;

              const fieldName = ['dues', memberIndex, 'dues', dueIndex];

              const isSelectedName = [...fieldName, 'isSelected'];

              const dueIdName = [...fieldName, 'dueId'];

              const amountName = [...fieldName, 'amount'];

              const isAmountValid = form.getFieldError(amountName).length === 0;

              return (
                <>
                  <Form.Item hidden name={['dues', memberIndex, 'memberId']}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hidden
                    name={isSelectedName}
                    valuePropName="checked"
                  >
                    <Checkbox />
                  </Form.Item>
                  <Form.Item
                    hidden
                    rules={[{ required: dueInForm.isSelected }]}
                    name={dueIdName}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    validateStatus={!isAmountValid ? 'error' : ''}
                    name={amountName}
                    className={isAmountValid ? 'mb-0' : ''}
                    rules={[
                      {
                        message: 'Requerido',
                        required: dueInForm.isSelected,
                      },
                      {
                        message: 'Requerido',
                        min: 1,
                        type: 'number',
                      },
                    ]}
                  >
                    <InputNumber
                      disabled={!dueInForm.isSelected}
                      className="w-32"
                      prefix={ARS.code}
                      precision={0}
                      decimalSeparator=","
                      step={100}
                    />
                  </Form.Item>
                </>
              );
            },
            title: 'Monto a registrar',
          },
        ]}
      />

      <Form.Item
        label="Notas"
        rules={[{ whitespace: true }]}
        name={['dues', memberIndex, 'notes']}
      >
        <TextArea />
      </Form.Item>
    </>
  );
};
