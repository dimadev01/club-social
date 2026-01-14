import { Button, Col } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card, Descriptions, DescriptionsAudit, NotFound, Row } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { useGroup } from './useGroup';

export function GroupView() {
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: group, isLoading } = useGroup(id);

  if (isLoading) {
    return <Card loading />;
  }

  if (!group) {
    return <NotFound />;
  }

  const canEdit = permissions.groups.update;

  return (
    <Card
      actions={[
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
      backButton
      title={group.name}
    >
      <Row gutter={[24, 24]}>
        <Col md={12} xs={24}>
          <Descriptions
            items={[
              {
                children: group.members.map((member) => member.name).join(', '),
                label: 'Miembros',
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
  );
}
