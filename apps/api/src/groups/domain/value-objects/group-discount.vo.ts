import { ApplicationError } from '@/shared/domain/errors/application.error';
import { Guard } from '@/shared/domain/guards';
import { err, ok, Result } from '@/shared/domain/result';
import { ValueObject } from '@/shared/domain/value-objects/value-object.base';

interface Props {
  value: number;
}

export class GroupDiscount extends ValueObject<Props> {
  public static readonly MAX_PERCENT = 99;
  public static readonly MIN_PERCENT = 0;
  public static readonly ZERO = new GroupDiscount({ value: 0 });

  public get value(): number {
    return this.props.value;
  }

  private constructor(props: Props) {
    super(props);
  }

  public static create(value: number): Result<GroupDiscount> {
    Guard.number(value);

    if (
      value < GroupDiscount.MIN_PERCENT ||
      value > GroupDiscount.MAX_PERCENT
    ) {
      return err(
        new ApplicationError(
          `El porcentaje de descuento debe estar entre ${GroupDiscount.MIN_PERCENT} y ${GroupDiscount.MAX_PERCENT}`,
        ),
      );
    }

    return ok(new GroupDiscount({ value }));
  }

  public static raw(props: Props): GroupDiscount {
    return new GroupDiscount(props);
  }

  public isZero(): boolean {
    return this.value === 0;
  }

  public toString(): string {
    return `${this.value}%`;
  }
}
