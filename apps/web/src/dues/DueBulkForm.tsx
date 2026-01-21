import type {
  PreviewBulkDuesMemberDto,
  PreviewBulkDuesResultDto,
} from '@club-social/shared/dues';
import type { MemberCategory } from '@club-social/shared/members';
import type dayjs from 'dayjs';

import { DateFormats, NumberFormat } from '@club-social/shared/lib';
import {
  MemberCategoryLabel,
  MemberCategorySort,
} from '@club-social/shared/members';
import { useState } from 'react';

import { labelMapToSelectOptions } from '@/shared/lib/utils';
import {
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  TABLE_COLUMN_WIDTHS,
} from '@/ui';

import { usePreviewBulkDues } from './usePreviewBulkDues';

export interface DueBulkFormData {
  date: dayjs.Dayjs;
  memberCategory: MemberCategory;
  notes: null | string;
}

interface DueBulkFormProps {
  disabled?: boolean;
  onSubmit: (data: DueBulkFormData, preview: PreviewBulkDuesResultDto) => void;
}

export function DueBulkForm({ disabled = false, onSubmit }: DueBulkFormProps) {
  const [form] = Form.useForm<DueBulkFormData>();
  const formMemberCategory = Form.useWatch('memberCategory', form);
  const [selectedKeys, setSelectedKeys] = useState<null | string[]>(null);

  const { data: preview, isLoading } = usePreviewBulkDues({
    memberCategory: formMemberCategory,
  });

  const allMemberIds = preview?.members.map((m) => m.memberId) ?? [];
  const effectiveSelectedKeys = selectedKeys ?? allMemberIds;
  const selectedMembers = preview?.members.filter((m) =>
    effectiveSelectedKeys.includes(m.memberId),
  );

  const filteredPreview: PreviewBulkDuesResultDto | undefined = selectedMembers
    ? {
        members: selectedMembers,
        summary: {
          totalAmount: selectedMembers.reduce((sum, m) => sum + m.amount, 0),
          totalMembers: selectedMembers.length,
        },
      }
    : undefined;

  return (
    <Form<DueBulkFormData>
      disabled={disabled}
      form={form}
      onFinish={(values) => {
        if (filteredPreview) {
          onSubmit(values, filteredPreview);
        }
      }}
    >
      <Form.Item<DueBulkFormData>
        label="Fecha"
        name="date"
        rules={[{ message: 'La fecha es requerida', required: true }]}
      >
        <DatePicker
          allowClear={false}
          format={DateFormats.monthYear}
          picker="month"
        />
      </Form.Item>

      <Form.Item<DueBulkFormData>
        label="Categoría de socio"
        name="memberCategory"
        rules={[
          { message: 'La categoría de socio es requerida', required: true },
        ]}
      >
        <Select
          onChange={() => setSelectedKeys(null)}
          options={labelMapToSelectOptions(MemberCategoryLabel).sort(
            (a, b) =>
              MemberCategorySort[a.value as MemberCategory] -
              MemberCategorySort[b.value as MemberCategory],
          )}
          placeholder="Seleccionar categoría de socio..."
        />
      </Form.Item>

      <Table<PreviewBulkDuesMemberDto>
        columns={[
          {
            dataIndex: 'memberName',
            sorter: (a, b) => a.memberName.localeCompare(b.memberName),
            title: 'Socio',
          },
          {
            align: 'center',
            dataIndex: 'memberCategory',
            render: (cat: MemberCategory) => MemberCategoryLabel[cat],
            title: 'Categoría',
            width: TABLE_COLUMN_WIDTHS.CATEGORY,
          },
          {
            align: 'right',
            dataIndex: 'baseAmount',
            render: (amt: number) => NumberFormat.currencyCents(amt),
            title: 'Monto Base',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'center',
            dataIndex: 'discountPercent',
            render: (percent: number, record) =>
              record.isGroupPricing ? `${percent}%` : '',
            title: 'Descuento',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
          {
            align: 'right',
            dataIndex: 'amount',
            render: (amt: number) => NumberFormat.currencyCents(amt),
            title: 'Monto Final',
            width: TABLE_COLUMN_WIDTHS.AMOUNT,
          },
        ]}
        dataSource={preview?.members}
        loading={isLoading}
        rowKey="memberId"
        rowSelection={{
          onChange: (keys) => setSelectedKeys(keys as string[]),
          selectedRowKeys: effectiveSelectedKeys,
        }}
        size="small"
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={5} index={0}>
                Total ({filteredPreview?.summary.totalMembers ?? 0} socios
                seleccionados)
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" index={1}>
                {NumberFormat.currencyCents(
                  filteredPreview?.summary.totalAmount ?? 0,
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <Form.Item<DueBulkFormData> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={1} />
      </Form.Item>
    </Form>
  );
}
