import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Payment } from '@domain/payments/entities/payment.entity';
import { FindPaginatedDuesRequest } from '@infra/mongo/repositories/dues/due-repository.types';

export interface IPaymentPort
  extends ICrudPort<Payment>,
    IPaginatedPort<Payment> {
  findPaginated(
    request: FindPaginatedDuesRequest
  ): Promise<FindPaginatedResponse<Payment>>;
}
