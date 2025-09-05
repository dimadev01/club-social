export enum EventResourceEnum {
  DUES = 'dues',
  MEMBERS = 'members',
  MOVEMENTS = 'movements',
  PAYMENTS = 'payments',
  PRICES = 'prices',
  SYSTEM = 'system',
}

export const EventResourceLabel: Record<EventResourceEnum, string> = {
  [EventResourceEnum.DUES]: 'Deudas',
  [EventResourceEnum.MEMBERS]: 'Socios',
  [EventResourceEnum.MOVEMENTS]: 'Movimientos',
  [EventResourceEnum.PAYMENTS]: 'Pagos',
  [EventResourceEnum.PRICES]: 'Precios',
  [EventResourceEnum.SYSTEM]: 'Sistema',
};

export enum EventActionEnum {
  CREATE = 'create',
  UPDATE = 'update',
  VOID = 'void',
}

export const EventActionLabel: Record<EventActionEnum, string> = {
  [EventActionEnum.CREATE]: 'Creación',
  [EventActionEnum.UPDATE]: 'Actualización',
  [EventActionEnum.VOID]: 'Anulación',
};
