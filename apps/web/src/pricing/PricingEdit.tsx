import type { UpdatePricingDto } from '@club-social/shared/pricing';

import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { PricingForm, type PricingFormData } from './PricingForm';
import { usePricing } from './usePricing';

export function PricingEdit() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: pricing, isLoading } = usePricing(id);

  const updatePricingMutation = useMutation<unknown, Error, UpdatePricingDto>({
    mutationFn: (body) => $fetch(`pricing/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Precio actualizado correctamente');
      navigate(-1);
    },
  });

  const handleSubmit = (values: PricingFormData) => {
    const amount = NumberFormat.toCents(values.amount);
    updatePricingMutation.mutate({
      amount,
      effectiveFrom: DateFormat.isoDate(values.effectiveFrom),
    });
  };

  if (!permissions.pricing.update) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Page loading title="Editar precio" />;
  }

  if (!pricing) {
    return <NotFound />;
  }

  const isMutating = updatePricingMutation.isPending;

  return (
    <Page
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Actualizar precio
        </FormSubmitButton>,
      ]}
      backButton
      title="Editar precio"
    >
      <PricingForm
        disabled={isMutating}
        initialValues={{
          amount: NumberFormat.fromCents(pricing.amount),
          dueCategory: pricing.dueCategory,
          effectiveFrom: dayjs.utc(pricing.effectiveFrom),
          memberCategory: pricing.memberCategory,
        }}
        mode="edit"
        onSubmit={handleSubmit}
      />
    </Page>
  );
}
