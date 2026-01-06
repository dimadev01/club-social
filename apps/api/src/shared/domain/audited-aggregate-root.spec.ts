import { AuditedAggregateRoot, AuditMeta } from './audited-aggregate-root';
import { UniqueId } from './value-objects/unique-id/unique-id.vo';

class TestAuditedAggregateRoot extends AuditedAggregateRoot {
  public constructor(id?: UniqueId, audit?: AuditMeta) {
    super(id, audit);
  }

  public updateAudit(updatedBy: string): void {
    this.markAsUpdated(updatedBy);
  }
}

describe('AuditedAggregateRoot', () => {
  it('should expose audit meta through getters', () => {
    const createdAt = new Date('2024-01-01');
    const updatedAt = new Date('2024-02-01');
    const audit: AuditMeta = {
      createdAt,
      createdBy: 'creator',
      updatedAt,
      updatedBy: 'updater',
    };

    const entity = new TestAuditedAggregateRoot(undefined, audit);

    expect(entity.createdAt).toBe(createdAt);
    expect(entity.createdBy).toBe('creator');
    expect(entity.updatedAt).toBe(updatedAt);
    expect(entity.updatedBy).toBe('updater');
  });

  it('should default audit meta to undefined values', () => {
    const entity = new TestAuditedAggregateRoot();

    expect(entity.createdAt).toBeUndefined();
    expect(entity.createdBy).toBeUndefined();
    expect(entity.updatedAt).toBeUndefined();
    expect(entity.updatedBy).toBeUndefined();
  });

  it('should use provided id when supplied', () => {
    const id = UniqueId.generate();
    const entity = new TestAuditedAggregateRoot(id);

    expect(entity.id.equals(id)).toBe(true);
  });

  it('should update updatedBy while preserving existing audit data', () => {
    const createdAt = new Date('2024-01-01');
    const audit: AuditMeta = {
      createdAt,
      createdBy: 'creator',
      updatedAt: null,
      updatedBy: null,
    };
    const entity = new TestAuditedAggregateRoot(undefined, audit);

    entity.updateAudit('new-updater');

    expect(entity.createdAt).toBe(createdAt);
    expect(entity.createdBy).toBe('creator');
    expect(entity.updatedAt).toBeNull();
    expect(entity.updatedBy).toBe('new-updater');
  });
});
