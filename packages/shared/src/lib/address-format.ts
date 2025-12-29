import { MemberAddressDto } from '../members';

export function formatAddress(
  address: MemberAddressDto | null | undefined,
): string {
  if (!address) {
    return '-';
  }

  const parts = [
    address.street,
    address.cityName,
    address.stateName,
    address.zipCode,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : '-';
}
