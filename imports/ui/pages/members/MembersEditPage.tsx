import React from 'react';
import { Breadcrumb, Card, DatePicker, Form, Input, Spin } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { NotFound } from '@ui/components/NotFound';
import { useCreateMember } from '@ui/hooks/members/useCreateMember';
import { useMember } from '@ui/hooks/members/useMember';
import { useUpdateMember } from '@ui/hooks/members/useUpdateMember';

type FormValues = {
  dateOfBirth: Dayjs;
  email: string;
  firstName: string;
  lastName: string;
};

export const MembersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { data, fetchStatus } = useMember(id);

  const createMember = useCreateMember();

  const updateMember = useUpdateMember();

  const handleSubmit = (values: FormValues) => {
    if (!id) {
      createMember.mutate({
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
      });
    } else {
      updateMember.mutate({
        email: values.email,
        firstName: values.firstName,
        id,
        lastName: values.lastName,
      });
    }
  };

  if (fetchStatus === 'fetching') {
    return <Spin spinning />;
  }

  if (id && !data) {
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
          {/* {!!data && `${data.profile?.firstName} ${data.profile?.lastName}`} */}
          {!data && 'Nuevo Socio'}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Form<FormValues>
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          initialValues={{}}
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

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Fecha de Nacimiento"
            rules={[{ required: true }, { type: 'date' }]}
          >
            <DatePicker
              className="w-full"
              disabledDate={(current: Dayjs) => current.isAfter(dayjs())}
            />
          </Form.Item>

          <ButtonGroup>
            <Button
              type="primary"
              disabled={createMember.isLoading || updateMember.isLoading}
              loading={createMember.isLoading || updateMember.isLoading}
              htmlType="submit"
            >
              Guardar
            </Button>
            <Button type="text" onClick={() => navigate(-1)}>
              Atrás
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </>
  );
};
