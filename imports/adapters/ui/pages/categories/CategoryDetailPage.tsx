import { ARS } from '@dinero.js/currencies';
import {
  App,
  Breadcrumb,
  Card,
  Form,
  Input,
  InputNumber,
  Skeleton,
} from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { FormButtons } from '@adapters/ui/components/Form/FormButtons';
import { NotFound } from '@adapters/ui/components/NotFound';
import { useCategory } from '@adapters/ui/hooks/categories/useCategory';
import { useUpdateCategory } from '@adapters/ui/hooks/categories/useUpdateCategory';
import { ScopeEnum } from '@domain/roles/role.enum';
import { MoneyUtils } from '@shared/utils/money.utils';

type FormValues = {
  amount: number | undefined;
};

export const CategoryDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const { message } = App.useApp();

  const { data: category, fetchStatus } = useCategory(id);

  const updateCategory = useUpdateCategory();

  const isLoading = fetchStatus === 'fetching';

  const handleSubmit = async (values: FormValues) => {
    if (category) {
      await updateCategory.mutateAsync({
        amount: values.amount ?? null,
        id: category._id,
      });

      message.success('Categoría actualizada');
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!category) {
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
            title: <Link to={AppUrl.Categories}>Categorías</Link>,
          },
          {
            title: category.name,
          },
        ]}
      />

      <Card>
        <Form<FormValues>
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          requiredMark={false}
          initialValues={{
            amount: category.amount
              ? MoneyUtils.fromCents(category.amount)
              : undefined,
            name: category.name,
          }}
        >
          <Form.Item name="name" label="Nombre">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Precio"
            rules={[{ min: 0, type: 'number' }]}
          >
            <InputNumber
              className="w-40"
              prefix={ARS.code}
              precision={0}
              decimalSeparator=","
              step={100}
            />
          </Form.Item>

          <FormButtons scope={ScopeEnum.CATEGORIES} />
        </Form>
      </Card>
    </>
  );
};
