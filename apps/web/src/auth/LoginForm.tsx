import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

import { AppLoading } from '@/app/AppLoading';

// interface FormSchema {
//   email: string;
// }

// const FormStatus = {
//   IDLE: 'idle',
//   SUBMITTING: 'submitting',
//   SUCCESS: 'success',
// } as const;

// type FormStatus = (typeof FormStatus)[keyof typeof FormStatus];

export function LoginForm() {
  // const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.IDLE);
  const { loginWithRedirect } = useAuth0();
  // const { message } = App.useApp();

  // const [form] = Form.useForm<FormSchema>();

  // const onSubmit = async (values: FormSchema) => {
  //   setFormStatus(FormStatus.SUBMITTING);

  //   const { error } = await supabase.auth.signInWithOtp({
  //     email: values.email,
  //     options: {
  //       emailRedirectTo: APP_ROUTES.HOME,
  //       shouldCreateUser: false,
  //     },
  //   });

  //   setFormStatus(error ? FormStatus.IDLE : FormStatus.SUCCESS);

  //   if (error) {
  //     message.error(error.message);
  //   }
  // };

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  // const isSubmitting = formStatus === FormStatus.SUBMITTING;

  return (
    <AppLoading />
    // <Flex className="w-full max-w-xs" gap="small" vertical>
    //   <Image
    //     alt="Club Social Logo"
    //     className="mx-auto max-w-[128px]"
    //     preview={false}
    //     rootClassName="w-full"
    //     src="/club-social-logo.png"
    //   />

    //   {formStatus === FormStatus.SUCCESS && (
    //     <Alert
    //       closable={{
    //         afterClose: () => setFormStatus(FormStatus.IDLE),
    //         closeIcon: true,
    //       }}
    //       description="Le hemos enviado un link para iniciar sesión"
    //       type="success"
    //     />
    //   )}

    //   {formStatus !== FormStatus.SUCCESS && (
    //     <Card
    //       actions={[
    //         <Button
    //           disabled={isSubmitting}
    //           form="form"
    //           htmlType="submit"
    //           icon={<LoginOutlined />}
    //           loading={isSubmitting}
    //           type="primary"
    //         >
    //           Iniciar sesión
    //         </Button>,
    //         <Button onClick={() => loginWithRedirect()}>
    //           Iniciar sesión con Auth0
    //         </Button>,
    //       ]}
    //     >
    //       <Form<FormSchema>
    //         disabled={isSubmitting}
    //         form={form}
    //         id="form"
    //         initialValues={{ email: '' }}
    //         layout="vertical"
    //         name="form"
    //         onFinish={onSubmit}
    //         scrollToFirstError
    //       >
    //         <Form.Item<FormSchema>
    //           label="Email"
    //           name="email"
    //           rules={[{ required: true, type: 'email', whitespace: true }]}
    //           tooltip="Recibirás un link para iniciar sesión"
    //         >
    //           <Input placeholder="juan.perez@example.com" type="email" />
    //         </Form.Item>
    //       </Form>
    //     </Card>
    //   )}

    //   <Flex justify="end">
    //     <MenuThemeSwitcher />
    //   </Flex>
    // </Flex>
  );
}
