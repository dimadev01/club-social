import { DueCategoryLabel } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import { MemberCategoryLabel } from '@club-social/shared/members';
import { Button, Col } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Card, Descriptions, DescriptionsAudit, NotFound, Row } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { usePricing } from './usePricing';

export function PricingView() {
  const permissions = usePermissions();
  const { id } = useParams();
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
    <Card
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
      <Row>
        <Col md={12} xs={24}>
          {' '}
          <Descriptions
            items={[
              {
                children: DateFormat.date(pricing.effectiveFrom),
                label: 'Vigente desde',
              },
              {
                children: pricing.effectiveTo
                  ? DateFormat.date(pricing.effectiveTo)
                  : '-',
                label: 'Vigente hasta',
              },
              {
                children: DueCategoryLabel[pricing.dueCategory],
                label: 'Tipo de deuda',
              },
              {
                children: MemberCategoryLabel[pricing.memberCategory],
                label: 'Categoría de socio',
              },
              {
                children: NumberFormat.formatCurrencyCents(pricing.amount),
                label: 'Monto',
              },
            ]}
          />
        </Col>
        <Col md={12} xs={24}>
          <DescriptionsAudit
            createdAt={pricing.createdAt}
            createdBy={pricing.createdBy}
            showVoidInfo={false}
            updatedAt={pricing.updatedAt}
            updatedBy={pricing.updatedBy}
          />
        </Col>
      </Row>
    </Card>
  );
}
