import { Form } from 'antd';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import React from 'react';

import { FormListInput } from '@ui/components/Form/FormListInput';

export const FormListEmails: React.FC = () => (
  <Form.List
    name="emails"
    rules={[
      {
        validator: async (_, names) => {
          if (compact(uniq(names)).length !== compact(names).length) {
            return Promise.reject(
              new Error('No se pueden ingresar emails duplicados'),
            );
          }

          return Promise.resolve();
        },
      },
    ]}
  >
    {(fields, { add, remove }, { errors }) => (
      <>
        {fields.map((field, index) => (
          <Form.Item
            required={fields.length > 1}
            label={`Email ${index + 1}`}
            key={field.key}
          >
            <Form.Item
              {...field}
              label={`Email ${index + 1}`}
              rules={[
                { required: fields.length > 1 },
                { type: 'email' },
                { whitespace: true },
              ]}
              noStyle
            >
              <FormListInput
                inputType="email"
                add={add}
                remove={remove}
                fieldName={field.name}
                index={index}
              />
            </Form.Item>
            <Form.ErrorList className="text-red-500" errors={errors} />
          </Form.Item>
        ))}
      </>
    )}
  </Form.List>
);
