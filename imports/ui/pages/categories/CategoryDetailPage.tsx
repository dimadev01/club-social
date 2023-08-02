import React from 'react';
import {
  Breadcrumb,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import compact from 'lodash/compact';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { NotFound } from '@ui/components/NotFound';
import { useCategory } from '@ui/hooks/categories/useCategory';
import { useCreateUser } from '@ui/hooks/users/useCreateUser';
import { useUpdateUser } from '@ui/hooks/users/useUpdateUser';

type FormValues = {
  emails: string[];
  firstName: string;
  lastName: string;
  role: string;
};

export const CategoryDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const { data: category, fetchStatus } = useCategory(id);

  const navigate = useNavigate();

  const createUser = useCreateUser();

  const updateUser = useUpdateUser();

  const handleSubmit = async (values: FormValues) => {
    if (!category) {
      const userId = await createUser.mutateAsync({
        emails: compact(values.emails).length > 0 ? values.emails : null,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      });

      message.success('Usuario creado');

      navigate(`${AppUrl.Users}/${userId}`);
    } else {
      await updateUser.mutateAsync({
        emails: compact(values.emails).length > 0 ? values.emails : null,
        firstName: values.firstName,
        id: category._id,
        lastName: values.lastName,
      });

      message.success('Usuario actualizado');
    }
  };

  const isLoading = fetchStatus === 'fetching';

  if (id && !category && !isLoading) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: <NavLink to={AppUrl.Categories}>Categorías</NavLink>,
          },
          {
            title: category?.name ?? 'Nueva Categoría',
          },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <Card>
          <Form<FormValues>
            layout="vertical"
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              amount: category?.amount ?? 0,
              name: category?.name ?? '',
            }}
          >
            <Form.Item
              name="name"
              label="Nombre"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Precio"
              rules={[{ min: 0, type: 'number' }]}
            >
              <InputNumber />
            </Form.Item>

            <ButtonGroup>
              <FormSaveButton
                loading={createUser.isLoading || updateUser.isLoading}
                disabled={createUser.isLoading || updateUser.isLoading}
              />

              <FormBackButton
                disabled={createUser.isLoading || updateUser.isLoading}
              />
            </ButtonGroup>
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
