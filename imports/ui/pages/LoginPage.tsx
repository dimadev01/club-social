import React from 'react';
import { Button, Card, Form, Image, Input, Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();

  const login = (values: LoginFormValues) => {
    Meteor.loginWithPassword(values.email, values.password, (error) => {
      if (error) {
        message.error(error.message);
      } else {
        navigate(AppUrl.Home);
      }
    });
  };

  return (
    <Layout className="min-h-full pt-24">
      <Card
        bordered={false}
        className="pt-10 md:pt-20 px-4 md:px-40 pb-8 md:pb-32 w-80 md:w-[670px] mx-auto rounded-bl-none rounded-tr-none rounded-tl-3xl rounded-br-3xl drop-shadow-xl mb-20"
        bodyStyle={{ padding: 0 }}
      >
        <Image
          wrapperClassName="w-full mb-16"
          preview={false}
          className="!w-36 mx-auto block"
          src="/images/logo.png"
          alt="Club Social logo"
        />

        <Form<LoginFormValues>
          onFinish={(values) => login(values)}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input
              size="large"
              className="text-sm"
              type="email"
              placeholder="Ingresa tu email"
            />
          </Form.Item>

          <Form.Item
            className="mb-16"
            label="Clave"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password
              size="large"
              className="text-sm"
              placeholder="Ingresa tu clave"
            />
          </Form.Item>

          <Button
            block
            className="rounded-bl-none rounded-tr-none rounded-tl-[10px] rounded-br-[10px]"
            type="primary"
            htmlType="submit"
            // disabled={isAuthenticating}
            // loading={isAuthenticating}
          >
            Iniciar Sesión
          </Button>
        </Form>
      </Card>

      {/* <div className="px-8 md:px-0 md:mx-auto w-full max-w-6xl mb-16 mt-auto">
        <hr className="mb-6 border-solid border-[#C2C2C2]" />

        <div className="flex items-center justify-between">
          <span className="block font-light">
            Rixsus ·{' '}
            <a
              href="https://www.rixsus.com/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
            >
              Terms & Conditions
            </a>
          </span>

          <Space>
            <a
              href="mailto:support@rixsus.com"
              target="_blank"
              rel="noreferrer"
            >
              <Icon component={EmailIcon} className="text-[40px]" />
            </a>

            <a href="https://rixsus.com/" target="_blank" rel="noreferrer">
              <Icon component={WhatsAppIcon} className="text-[40px]" />
            </a>

            <a href="https://rixsus.com/" target="_blank" rel="noreferrer">
              <Icon component={TelegramIcon} className="text-[40px]" />
            </a>
          </Space>
        </div>
      </div> */}
    </Layout>
  );
};
