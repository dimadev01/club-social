import {
  DueCategoryLabel,
  DueStatus,
  DueStatusLabel,
  type VoidDueDto,
} from '@club-social/shared/dues';
import { App, Button, Descriptions, Divider, Grid, Tag } from 'antd';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { Card } from '@/ui/Card';
import { EditIcon } from '@/ui/Icons/EditIcon';
import { NotFound } from '@/ui/NotFound';
import { Table } from '@/ui/Table/Table';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { DueStatusColor } from './due.types';
import { useDue } from './useDue';

export function DueView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: due, error, isLoading } = useDue(id);

  if (error) {
    console.error(error);
  }

  const voidDueMutation = useMutation<unknown, Error, VoidDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}/void`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Cuota anulada correctamente');
      navigate(-1);
    },
  });

  if (isLoading) {
    return <Card loading />;
  }

  if (!due) {
    return <NotFound />;
  }

  const isMutating = voidDueMutation.isPending;
  const canEdit = permissions.dues.update && due.status === DueStatus.PENDING;
  const canVoid = permissions.dues.void && due.status === DueStatus.PENDING;

  return (
    <Card
      actions={[
        canEdit && (
          <Button
            disabled={isMutating}
            icon={<EditIcon />}
            onClick={() => navigate(appRoutes.dues.edit(id))}
            type="primary"
          >
            Editar
          </Button>
        ),
        canVoid && (
          <Button
            danger
            disabled={isMutating}
            onClick={() => setIsVoidModalOpen(true)}
            type="primary"
          >
            Anular deuda
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      title="Detalle de deuda"
    >
      <Descriptions
        bordered
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Fecha">
          {DateFormat.date(due.date)}
        </Descriptions.Item>
        <Descriptions.Item label="Socio">
          <Link to={appRoutes.members.view(due.memberId)}>
            {due.memberName}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Categoría">
          {DueCategoryLabel[due.category]}
        </Descriptions.Item>
        <Descriptions.Item label="Monto">
          {NumberFormat.formatCents(due.amount)}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Tag color={DueStatusColor[due.status]}>
            {DueStatusLabel[due.status]}
          </Tag>
        </Descriptions.Item>
        {due.notes && (
          <Descriptions.Item label="Notas" span={2}>
            {due.notes}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider />

      <Card title="Pagos" type="inner">
        <Table dataSource={[]} />
      </Card>

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidDueMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
