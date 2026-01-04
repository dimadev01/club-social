import { InfoCircleOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';

interface Props {
  title?: string;
  tooltip?: string;
}

export function TableSummaryTotalFilterText({
  title = 'Total',
  tooltip = 'Considera solamente los filtros activos',
}: Props) {
  return (
    <Space size="small">
      {title}
      <Tooltip title={tooltip}>
        <InfoCircleOutlined />
      </Tooltip>
    </Space>
  );
}
