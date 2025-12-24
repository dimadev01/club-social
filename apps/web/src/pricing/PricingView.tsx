import { DueCategoryLabel } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { MemberCategoryLabel } from '@club-social/shared/members';
import { Button, Descriptions, Divider, Grid } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { DateFormat } from '@/shared/lib/date-format';
import { Card } from '@/ui/Card';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { usePermissions } from '@/users/use-permissions';

import { usePricing } from './usePricing';

export function PricingView() {
  const permissions = usePermissions();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  const { data: pricing, isLoading } = usePricing(id);

  if (isLoading) {
    return <Card loading />;
  }

  if (!pricing) {
    return <NotFound />;
  }

  const canEdit = permissions.pricing.update && pricing.effectiveTo === null;

  return (
    <Page
      actions={[
        canEdit && (
          <Button
            onClick={() => navigate(appRoutes.pricing.edit(id))}
            type="primary"
          >
            Editar
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      title="Detalle de precio"
    >
      <Descriptions
        bordered
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Vigente desde">
          {DateFormat.date(pricing.effectiveFrom)}
        </Descriptions.Item>
        <Descriptions.Item label="Vigente hasta">
          {pricing.effectiveTo ? DateFormat.date(pricing.effectiveTo) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Tipo de deuda">
          {DueCategoryLabel[pricing.dueCategory]}
        </Descriptions.Item>
        <Descriptions.Item label="Categoría de socio">
          {MemberCategoryLabel[pricing.memberCategory]}
        </Descriptions.Item>
        <Descriptions.Item label="Monto">
          {NumberFormat.formatCents(pricing.amount)}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <DescriptionsAudit
        createdAt={pricing.createdAt}
        createdBy={pricing.createdBy}
        showVoidInfo={false}
        updatedAt={pricing.updatedAt}
        updatedBy={pricing.updatedBy}
      />
    </Page>
  );
}
