import { Descriptions, Grid } from 'antd';

import { DateFormat } from '@/shared/lib/date-format';

interface Props {
  createdAt: string;
  createdBy: string;
  showVoidInfo?: boolean;
  updatedAt: string;
  updatedBy: string;
  voidedAt?: null | string;
  voidedBy?: null | string;
  voidReason?: null | string;
}

export function DescriptionsAudit({ showVoidInfo = true, ...props }: Props) {
  const { md } = Grid.useBreakpoint();

  return (
    <Descriptions
      column={md ? 2 : 1}
      layout={md ? 'horizontal' : 'vertical'}
      size="small"
    >
      <Descriptions.Item label="Creado por">
        {props.createdBy}
      </Descriptions.Item>
      <Descriptions.Item label="Creado el">
        {DateFormat.dateTime(props.createdAt)}
      </Descriptions.Item>
      <Descriptions.Item label="Actualizado por">
        {props.updatedBy}
      </Descriptions.Item>
      <Descriptions.Item label="Actualizado el">
        {DateFormat.dateTime(props.updatedAt)}
      </Descriptions.Item>
      {showVoidInfo && (
        <>
          <Descriptions.Item label="Anulado por">
            {props.voidedBy ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Anulado el">
            {props.voidedAt ? DateFormat.dateTime(props.voidedAt) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Razón de anulación">
            {props.voidReason ?? '-'}
          </Descriptions.Item>
        </>
      )}
    </Descriptions>
  );
}
