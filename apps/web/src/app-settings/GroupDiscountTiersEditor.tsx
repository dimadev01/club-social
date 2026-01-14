import type { GroupDiscountTier } from '@club-social/shared/app-settings';

import { Descriptions, InputNumber } from '@/ui';

interface GroupDiscountTiersEditorProps {
  disabled?: boolean;
  onChange: (tiers: GroupDiscountTier[]) => void;
  value: GroupDiscountTier[];
}

export function GroupDiscountTiersEditor({
  disabled = false,
  onChange,
  value,
}: GroupDiscountTiersEditorProps) {
  const handlePercentChange = (index: number, percent: null | number) => {
    if (percent === null) {
      return;
    }

    const newTiers = value.map((tier, i) =>
      i === index ? { ...tier, percent } : tier,
    );

    onChange(newTiers);
  };

  const getTierLabel = (tier: GroupDiscountTier) =>
    tier.minSize === tier.maxSize
      ? `${tier.minSize} miembros`
      : `${tier.minSize}-${tier.maxSize} miembros`;

  return (
    <Descriptions
      items={value.map((tier, index) => ({
        children: (
          <InputNumber
            disabled={disabled}
            max={100}
            min={1}
            onChange={(val) => handlePercentChange(index, val)}
            precision={0}
            suffix="%"
            value={tier.percent}
          />
        ),
        key: index,
        label: getTierLabel(tier),
      }))}
    />
  );
}
