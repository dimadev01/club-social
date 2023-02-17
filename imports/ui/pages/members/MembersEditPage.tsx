import React from 'react';
import {
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Spin,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import { compact } from 'lodash';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { MemberCategoryOptions } from '@domain/members/members.enum';
import { Role } from '@domain/roles/roles.enum';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormListEmails } from '@ui/components/Form/FormListEmails';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { NotFound } from '@ui/components/NotFound';
import { useCreateMember } from '@ui/hooks/members/useCreateMember';
import { useMember } from '@ui/hooks/members/useMember';
import { useUpdateMember } from '@ui/hooks/members/useUpdateMember';

type FormValues = {
  dateOfBirth: Dayjs | undefined;
  emails: string[];
  firstName: string;
  lastName: string;
};

export const MembersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { data: member, fetchStatus } = useMember(id);

  const createMember = useCreateMember();

  const updateMember = useUpdateMember();

  const handleSubmit = async (values: FormValues) => {
    if (!id) {
      const memberId = await createMember.mutateAsync({
        dateOfBirth: values.dateOfBirth
          ? DateUtils.format(values.dateOfBirth)
          : null,
        emails: compact(values.emails).length > 0 ? values.emails : null,
        firstName: values.firstName,
        lastName: values.lastName,
        role: Role.Member,
      });

      message.success('Socio creado');

      navigate(`${AppUrl.Members}/${memberId}`);
    } else {
      await updateMember.mutateAsync({
        dateOfBirth: values.dateOfBirth
          ? DateUtils.format(values.dateOfBirth)
          : null,
        emails: values.emails,
        firstName: values.firstName,
        id,
        lastName: values.lastName,
      });

      message.success('Socio actualizado');
    }
  };

  if (fetchStatus === 'fetching') {
    return <Spin spinning />;
  }

  if (id && !member) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to={AppUrl.Members}>Socios</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {!!member && `${member.firstName} ${member.lastName}`}
          {!member && 'Nuevo Socio'}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Form<FormValues>
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            dateOfBirth: member?.dateOfBirth
              ? dayjs.utc(member.dateOfBirth)
              : undefined,
            emails: member?.emails ?? [''],
            firstName: member?.firstName ?? '',
            lastName: member?.lastName ?? '',
          }}
        >
          <Form.Item
            name="firstName"
            label="Nombre"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Apellido"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <FormListEmails />

          <Form.Item
            name="dateOfBirth"
            label="Fecha de Nacimiento"
            rules={[{ type: 'date' }]}
          >
            <DatePicker
              format={DateFormats.DD_MM_YYYY}
              className="w-full"
              disabledDate={(current: Dayjs) => current.isAfter(dayjs())}
            />
          </Form.Item>

          <Form.Item label="Categoría" name="category">
            <Select options={MemberCategoryOptions()} />
          </Form.Item>

          <ButtonGroup>
            <FormSaveButton />

            <FormBackButton to={AppUrl.Members} />
          </ButtonGroup>
        </Form>
      </Card>
    </>
  );
};
