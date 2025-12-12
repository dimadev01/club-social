export abstract class Mapper<TDomain, TPersistence> {
  public abstract toDomain(persistence: TPersistence): TDomain;
  public abstract toPersistence(domain: TDomain): TPersistence;
}
