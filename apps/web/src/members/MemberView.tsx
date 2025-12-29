import { DateFormat, formatAddress } from '@club-social/shared/lib';
import {
  FileStatusLabel,
  MaritalStatusLabel,
  MemberCategoryLabel,
  MemberNationalityLabel,
  MemberSexLabel,
} from '@club-social/shared/members';
import { UserStatusLabel } from '@club-social/shared/users';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { useMemberById } from './useMemberById';

export function MemberView() {
  const permissions = usePermissions();
  const { id } = useParams();
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
    <Page
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
      loading={isLoading}
      title={member.name}
    >
      <Descriptions
        items={[
          {
            children: member.firstName,
            label: 'Nombre',
          },
          {
            children: member.lastName,
            label: 'Apellido',
          },
          {
            children: member.email,
            label: 'Email',
          },
          {
            children: MemberCategoryLabel[member.category],
            label: 'Categoría',
          },
          {
            children: UserStatusLabel[member.status],
            label: 'Estado',
          },
          {
            children: FileStatusLabel[member.fileStatus],
            label: 'Ficha',
          },
          {
            children: member.birthDate
              ? DateFormat.date(member.birthDate)
              : '-',
            label: 'Fecha de nacimiento',
          },
          {
            children: member.documentID || '-',
            label: 'Documento',
          },
          {
            children: member.nationality
              ? MemberNationalityLabel[member.nationality]
              : '-',
            label: 'Nacionalidad',
          },
          {
            children: member.sex ? MemberSexLabel[member.sex] : '-',
            label: 'Sexo',
          },
          {
            children: member.maritalStatus
              ? MaritalStatusLabel[member.maritalStatus]
              : '-',
            label: 'Estado civil',
          },
          {
            children: member.phones.length > 0 ? member.phones.join(', ') : '-',
            label: 'Teléfonos',
          },
          {
            children: formatAddress(member.address),
            label: 'Dirección',
          },
        ]}
      />
    </Page>
  );
}
