import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { CreateDueRequestDto } from '@adapters/dtos/create-due-request.dto';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid.request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { GetPendingDuesRequestDto } from '@adapters/dtos/get-pending-dues-request.dto';
import { DueDtoMapper } from '@adapters/mappers/due-dto.mapper';
import { DIToken } from '@application/common/di/tokens.di';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DueDto } from '@application/dues/dtos/due.dto';
import { CreateDueUseCase } from '@application/dues/use-cases/create-due/create-due.use-case';
import { DeleteDueUseCase } from '@application/dues/use-cases/delete-due/delete-due.use-case';
import { GetDueUseCase } from '@application/dues/use-cases/get-due/get-due.use-case';
import { GetDuesGridResponse } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.response';
import { GetDuesGridUseCase } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.use-case';
import { GetPendingDuesUseCase } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';
import { Due } from '@domain/dues/models/due.model';

@injectable()
export class DueController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _createDue: CreateDueUseCase,
    private readonly _getDue: GetDueUseCase,
    private readonly _deleteDue: DeleteDueUseCase,
    private readonly _getDuesGrid: GetDuesGridUseCase,
    private readonly _getPendingDues: GetPendingDuesUseCase,
    private readonly _dueDtoMapper: DueDtoMapper,
  ) {
    super(logger);
  }

  public async create(request: CreateDueRequestDto): Promise<DueDto[]> {
    const dues = await this.execute({
      classType: CreateDueRequestDto,
      request,
      useCase: this._createDue,
    });

    return dues.map((due) => this._dueDtoMapper.toDto(due));
  }

  public async get(request: GetOneDtoByIdRequestDto): Promise<DueDto | null> {
    const due = await this.execute({
      classType: GetOneDtoByIdRequestDto,
      request,
      useCase: this._getDue,
    });

    if (!due) {
      return null;
    }

    return this._dueDtoMapper.toDto(due);
  }

  public async delete(request: GetOneDtoByIdRequestDto): Promise<void> {
    await this.execute({
      classType: GetOneDtoByIdRequestDto,
      request,
      useCase: this._deleteDue,
    });
  }

  public async getGrid(
    request: GetDuesGridRequestDto,
  ): Promise<GetDuesGridResponse<DueGridDto>> {
    const { items, totalCount } = await this.execute({
      classType: GetDuesGridRequestDto,
      request,
      useCase: this._getDuesGrid,
    });

    return {
      items: items.map<DueGridDto>((due: Due) => {
        invariant(due.member);

        return {
          amount: due.amount.amount,
          category: due.category,
          date: due.date.toISOString(),
          id: due._id,
          isDeleted: due.isDeleted,
          memberId: due.memberId,
          memberName: due.member.name,
          notes: due.notes,
          status: due.status,
        };
      }),
      totalCount,
    };
  }

  public async getPending(
    request: GetPendingDuesRequestDto,
  ): Promise<DueDto[]> {
    const dues = await this.execute({
      classType: GetPendingDuesRequestDto,
      request,
      useCase: this._getPendingDues,
    });

    return dues.map((due) => this._dueDtoMapper.toDto(due));
  }
}
