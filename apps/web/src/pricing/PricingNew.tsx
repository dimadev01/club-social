import type { CreatePricingDto } from '@club-social/shared/pricing';
import type { ParamIdDto } from '@club-social/shared/types';

import { DueCategory } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { MemberCategory } from '@club-social/shared/members';
import { usePostHog } from '@posthog/react';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { PricingForm, type PricingFormData } from './PricingForm';

export function PricingNew() {
  const { message } = App.useApp();
  const posthog = usePostHog();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createPricingMutation = useMutation<
    ParamIdDto,
    Error,
    CreatePricingDto
  >({
    mutationFn: (body) => $fetch('/pricing', { body, method: 'POST' }),
    onSuccess: (_data, variables) => {
      message.success('Precio creado correctamente');
      posthog.capture(PostHogEvent.PRICING_CREATED, {
        due_category: variables.dueCategory,
        member_category: variables.memberCategory,
      });
      navigate(appRoutes.pricing.list, { replace: true });
    },
  });

  const handleSubmit = (values: PricingFormData) => {
    const amount = NumberFormat.toCents(values.amount);

    createPricingMutation.mutate({
      amount,
      dueCategory: values.dueCategory,
      effectiveFrom: DateFormat.isoDate(values.effectiveFrom),
      memberCategory: values.memberCategory,
    });
  };

  if (!permissions.pricing.create) {
    return <NotFound />;
  }

  const isMutating = createPricingMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Crear precio
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo precio"
    >
      <PricingForm
        disabled={isMutating}
        initialValues={{
          amount: 0,
          dueCategory: DueCategory.MEMBERSHIP,
          effectiveFrom: dayjs(),
          memberCategory: MemberCategory.MEMBER,
        }}
        mode="create"
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
