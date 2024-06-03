import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { GetDuesGridRequest } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.request';

export class GetDuesGridRequestDto
  extends GetGridRequestDto
  implements GetDuesGridRequest {}
