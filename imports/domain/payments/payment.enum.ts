export enum PaymentStatusEnum {
  PAID = 'paid',
  VOIDED = 'voided',
}

export enum PaymentDueSourceEnum {
  CREDIT = 'credit',
  DIRECT = 'direct',
}

export const PaymentStatusLabel = {
  [PaymentStatusEnum.PAID]: 'Pagado',
  [PaymentStatusEnum.VOIDED]: 'Anulado',
};

export const getPaymentStatusColumnFilters = () =>
  Object.values(PaymentStatusEnum)
    .map((category) => ({
      text: PaymentStatusLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
