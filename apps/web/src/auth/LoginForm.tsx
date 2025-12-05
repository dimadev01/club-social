// import {
//   Alert,
//   Button,
//   LoadingOverlay,
//   Stack,
//   Text,
//   TextInput,
// } from '@mantine/core';
// import { useForm } from '@mantine/form';
// import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
// import { zod4Resolver } from 'mantine-form-zod-resolver';
// import { useState } from 'react';
// import { z } from 'zod';

// import { APP_ROUTES } from '@/app/app.enum';
// import { supabase } from '@/shared/lib/supabase';

// const _schema = z
//   .object({ email: z.email({ error: 'Email inválido' }) })
//   .strict();

// type FormSchema = z.infer<typeof _schema>;

export function LoginForm() {
  return <div>Login Form</div>;
  // const form = useForm<FormSchema>({
  //   initialValues: {
  //     email: '',
  //   },
  //   mode: 'uncontrolled',
  //   validate: zod4Resolver(_schema),
  // });

  // const [successMessage, setSuccessMessage] = useState<null | string>(null);
  // const [authErrorMessage, setAuthErrorMessage] = useState<null | string>(null);

  // const onSubmit = async (data: FormSchema) => {
  //   const { error } = await supabase.auth.signInWithOtp({
  //     email: data.email,
  //     options: {
  //       emailRedirectTo: APP_ROUTES.HOME,
  //       shouldCreateUser: false,
  //     },
  //   });

  //   if (error && error.message === 'Signups not allowed for otp') {
  //     setAuthErrorMessage('No encontramos tu cuenta');

  //     return;
  //   }

  //   setSuccessMessage('Te enviamos un link para iniciar sesión');
  // };

  // if (successMessage) {
  //   return (
  //     <div className="flex-1">
  //       <Alert color="green" icon={<IconCheck />} mb="md">
  //         <Text>{successMessage}</Text>
  //       </Alert>

  //       <Button
  //         onClick={() => {
  //           setSuccessMessage(null);
  //         }}
  //       >
  //         Volver
  //       </Button>
  //     </div>
  //   );
  // }

  // if (authErrorMessage) {
  //   return (
  //     <div className="flex-1">
  //       <Alert color="red" icon={<IconAlertCircle />} mb="md">
  //         <Text>{authErrorMessage}</Text>
  //       </Alert>

  //       <Button
  //         onClick={() => {
  //           setAuthErrorMessage(null);
  //           form.setFieldValue('email', '');
  //         }}
  //       >
  //         Volver
  //       </Button>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="flex-1">
  //     <form className="relative" onSubmit={form.onSubmit(onSubmit)}>
  //       <LoadingOverlay visible={form.submitting} />
  //       <Stack>
  //         <TextInput
  //           autoFocus
  //           key={form.key('email')}
  //           label="Email"
  //           placeholder="juan.perez@email.com"
  //           type="email"
  //           {...form.getInputProps('email')}
  //         />

  //         <Button
  //           disabled={form.submitting}
  //           fullWidth
  //           loading={form.submitting}
  //           type="submit"
  //         >
  //           {form.submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
  //         </Button>
  //       </Stack>
  //     </form>
  //   </div>
  // );
}
