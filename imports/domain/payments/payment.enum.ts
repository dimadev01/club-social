export enum PaymentStatusEnum {
  Canceled = 'canceled',
  Paid = 'paid',
}

export const PaymentStatusLabel = {
  [PaymentStatusEnum.Canceled]: 'Cancelado',
  [PaymentStatusEnum.Paid]: 'Pagado',
};

export const getPaymentStatusColumnFilters = () =>
  Object.values(PaymentStatusEnum)
    .map((category) => ({
      text: PaymentStatusLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
