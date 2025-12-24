import type { ICreatePricingDto } from '@club-social/shared/pricing';
import type { ParamId } from '@club-social/shared/types';

import { DueCategory } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { MemberCategory } from '@club-social/shared/members';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { PricingForm, type PricingFormData } from './PricingForm';

export function PricingNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createPricingMutation = useMutation<ParamId, Error, ICreatePricingDto>({
    mutationFn: (body) => $fetch('/pricing', { body, method: 'POST' }),
    onSuccess: () => {
      message.success('Precio creado correctamente');
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
    <Page
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
    </Page>
  );
}
