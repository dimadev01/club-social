import { Model } from '@domain/common/models/model';

export abstract class MapperDto<TDomain extends Model, TDto> {
  public abstract toDto(domain: TDomain): TDto;
}
