import { Card, Descriptions, Form, Space } from 'antd';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryLabel } from '@domain/dues/due.enum';
import { MemberCategoryLabel } from '@domain/members/member.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';
import { PricesIcon } from '@ui/components/Icons/PricesIcon';
import { NotFound } from '@ui/components/NotFound';
import { usePrice } from '@ui/hooks/prices/usePrice';
import { useUpdatePrice } from '@ui/hooks/prices/useUpdatePrice';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

type FormValues = {
  categories: Array<{ amount: number; id: string }>;
};

export const PriceEditPage = () => {
  const { id: priceId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { data: price, error } = usePrice(
    priceId ? { id: priceId } : undefined,
  );

  const notificationSuccess = useNotificationSuccess();

  const updatePrice = useUpdatePrice();

  const handleSubmit = async (values: FormValues) => {
    invariant(price);

    updatePrice.mutate(
      {
        categories: values.categories.map((category, index) => ({
          amount: Money.fromNumber(category.amount).amount,
          id: price.categories[index].id,
        })),
        id: price.id,
      },
      {
        onSuccess: () => {
          notificationSuccess('Precios actualizados');

          navigate(-1);
        },
      },
    );
  };

  if (error) {
    return <NotFound />;
  }

  if (!price) {
    return <Card loading />;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <PricesIcon />
                <Link to={`/${AppUrl.PRICES}`}>Precios</Link>
              </Space>
            ),
          },
          {
            title: `Editando precio de ${DueCategoryLabel[price.dueCategory]}`,
          },
        ]}
      />

      <Card
        extra={<PricesIcon />}
        title={`Editando precio de ${DueCategoryLabel[price.dueCategory]}`}
      >
        <Form<FormValues>
          layout="vertical"
          disabled={updatePrice.isLoading}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            categories: price.categories.map((category) => ({
              amount: Money.from({ amount: category.amount }).toInteger(),
            })),
          }}
        >
          <Descriptions
            column={1}
            layout="vertical"
            colon={false}
            className="mb-4"
          >
            <Descriptions.Item label="Categoría">
              {DueCategoryLabel[price.dueCategory]}
            </Descriptions.Item>
          </Descriptions>

          <Form.List name="categories">
            {(fields) => (
              <Descriptions
                column={{ lg: 4, md: 2, sm: 1, xl: 4, xs: 1, xxl: 4 }}
                layout="vertical"
                colon={false}
                style={{ marginBottom: 24 }}
              >
                {fields.map(({ key, name, ...restField }) => (
                  <React.Fragment key={key}>
                    <Descriptions.Item
                      label={
                        MemberCategoryLabel[
                          price.categories[name].memberCategory
                        ]
                      }
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        noStyle
                        rules={[{ required: true }, { min: 1, type: 'number' }]}
                      >
                        <FormInputAmount />
                      </Form.Item>
                    </Descriptions.Item>
                  </React.Fragment>
                ))}
              </Descriptions>
            )}
          </Form.List>

          <FormButtons
            saveButtonProps={{
              disabled: updatePrice.isLoading,
              text: 'Actualizar precio',
            }}
            scope={ScopeEnum.PRICES}
          />
        </Form>
      </Card>
    </>
  );
};
