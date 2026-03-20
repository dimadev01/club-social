import { useQueryClient } from '@tanstack/react-query';
import { App, Button, Col, Space, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { queryKeys } from '@/shared/lib/query-keys';
import {
  Card,
  Descriptions,
  DescriptionsAudit,
  NotFound,
  Page,
  PageHeader,
  PageTitle,
  Row,
} from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { useGroup } from './useGroup';

export function GroupView() {
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();

  const { data: group, isLoading } = useGroup(id);

  const { isPending: isDeleting, mutate: deleteGroup } = useMutation({
    mutationFn: () => $fetch(`groups/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      message.success('Grupo eliminado');
      navigate(appRoutes.groups.list);
      queryClient.invalidateQueries({ queryKey: queryKeys.groups._def });
    },
  });

  if (isLoading) {
    return <Card loading />;
  }

  if (!group) {
    return <NotFound />;
  }

  const canEdit = permissions.groups.update;
  const canDelete = permissions.groups.delete;

  const handleDelete = () => {
    modal.confirm({
      content: 'Esta acción no se puede deshacer.',
      okButtonProps: { danger: true },
      okText: 'Eliminar',
      onOk: () => deleteGroup(),
      title: '¿Eliminar grupo?',
    });
  };

  return (
    <Page>
      <PageHeader backButton>
        <PageTitle>{group.name}</PageTitle>
      </PageHeader>
      <Card
        actions={[
          canDelete && (
            <Button
              danger
              key="delete"
              loading={isDeleting}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          ),
          canEdit && (
            <Button
              key="edit"
              onClick={() => navigate(appRoutes.groups.edit(id))}
              type="primary"
            >
              Editar
            </Button>
          ),
        ].filter(Boolean)}
      >
        <Row gutter={[24, 24]}>
          <Col md={12} xs={24}>
            <Descriptions
              items={[
                {
                  children: (
                    <Space size="small" wrap>
                      {group.members.map((member) => (
                        <Tag key={member.id}>{member.name}</Tag>
                      ))}
                    </Space>
                  ),
                  label: 'Miembros',
                },
                {
                  children: `${group.discountPercent}%`,
                  label: 'Descuento',
                },
              ]}
            />
          </Col>
          <Col md={12} xs={24}>
            <DescriptionsAudit
              createdAt={group.createdAt}
              createdBy={group.createdBy}
              showVoidInfo={false}
              updatedAt={group.updatedAt}
              updatedBy={group.updatedBy}
            />
          </Col>
        </Row>
      </Card>
    </Page>
  );
}
