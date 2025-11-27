import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@mantine/core';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { APP_ROUTES } from '@/app.enum';
import { supabase } from '@/supabase/client';

const _schema = z.object({ email: z.email() }).strict();

type FormSchema = z.infer<typeof _schema>;

export function LoginForm() {
  const form = useForm<FormSchema>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(_schema),
  });
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: APP_ROUTES.ROOT,
          shouldCreateUser: false,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            aria-invalid={fieldState.invalid}
            autoComplete="on"
            id={field.name}
            placeholder="juan@example.com"
            w="100%"
          />
        )}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" disabled={isLoading} fullWidth type="submit">
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
