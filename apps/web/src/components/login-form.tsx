import { zodResolver } from '@hookform/resolvers/zod';
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
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="on"
                id={field.name}
                placeholder="juan@example.com"
              />
            )}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
