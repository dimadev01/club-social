import {
  FileStatusLabel,
  MaritalStatusLabel,
  MemberCategoryLabel,
  MemberNationalityLabel,
  MemberSexLabel,
} from '@club-social/shared/members';
import { UserStatusLabel } from '@club-social/shared/users';
import { Button, Descriptions, Grid } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { DateFormat } from '@/shared/lib/date-format';
import { Card } from '@/ui/Card';
import { NotFound } from '@/ui/NotFound';
import { usePermissions } from '@/users/use-permissions';

import { useMemberById } from './useMemberById';

export function MemberView() {
  const permissions = usePermissions();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  const { data: member, isLoading } = useMemberById(id);

  if (isLoading) {
    return <Card loading />;
  }

  if (!member) {
    return <NotFound />;
  }

  const canEdit = permissions.members.update;

  return (
    <Card
      actions={[
        canEdit && (
          <Button
            onClick={() => navigate(appRoutes.members.edit(id))}
            type="primary"
          >
            Editar
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      title={member.name}
    >
      <Descriptions
        colon={!!md}
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Nombre">{member.firstName}</Descriptions.Item>
        <Descriptions.Item label="Apellido">
          {member.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{member.email}</Descriptions.Item>
        <Descriptions.Item label="Categoría">
          {MemberCategoryLabel[member.category]}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          {UserStatusLabel[member.status]}
        </Descriptions.Item>
        <Descriptions.Item label="Ficha">
          {FileStatusLabel[member.fileStatus]}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de nacimiento">
          {member.birthDate ? DateFormat.date(member.birthDate) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Documento">
          {member.documentID || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Nacionalidad">
          {member.nationality
            ? MemberNationalityLabel[member.nationality]
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Sexo">
          {member.sex ? MemberSexLabel[member.sex] : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Estado civil">
          {member.maritalStatus
            ? MaritalStatusLabel[member.maritalStatus]
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Teléfonos">
          {member.phones.length > 0 ? member.phones.join(', ') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección" span={2}>
          {member.address &&
          [
            member.address.street,
            member.address.cityName,
            member.address.stateName,
            member.address.zipCode,
          ].some(Boolean)
            ? [
                member.address.street,
                member.address.cityName,
                member.address.stateName,
                member.address.zipCode,
              ]
                .filter(Boolean)
                .join(', ')
            : '-'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
