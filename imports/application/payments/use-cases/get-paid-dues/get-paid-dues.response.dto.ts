import { PaidDueDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-due.dto';

export class GetPaidDuesResponseDto {
  data: PaidDueDto[];
}
