export enum PaymentStatusEnum {
  Paid = 'paid',
}

export const PaymentStatusLabel = {
  [PaymentStatusEnum.Paid]: 'Pagado',
};

export const getPaymentStatusColumnFilters = () =>
  Object.values(PaymentStatusEnum)
    .map((category) => ({
      text: PaymentStatusLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
