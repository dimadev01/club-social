import { ApplicationError } from '../../errors/application.error';
import { Guard } from '../../guards';
import { err, ok, Result } from '../../result';
import { ValueObject } from '../value-object.base';

interface Props {
  cents: number;
}

export class SignedAmount extends ValueObject<Props> {
  public static readonly ZERO = new SignedAmount({ cents: 0 });

  public get cents(): number {
    return this.props.cents;
  }

  protected constructor(props: Props) {
    super(props);
  }

  /**
   * Creates an Amount from cents (integer)
   * @param cents - Amount in cents (e.g., 1050 for $10.50)
   */
  public static fromCents(cents: number): Result<SignedAmount> {
    Guard.number(cents);

    if (!Number.isInteger(cents)) {
      return err(new ApplicationError('Amount in cents must be an integer'));
    }

    if (!Number.isFinite(cents)) {
      return err(new ApplicationError('Amount must be a finite number'));
    }

    if (cents > 9_999_999_999) {
      return err(new ApplicationError('Amount exceeds maximum allowed value'));
    }

    return ok(new SignedAmount({ cents }));
  }

  public static fromDollars(dollars: number): Result<SignedAmount> {
    Guard.number(dollars);

    if (!Number.isFinite(dollars)) {
      return err(new ApplicationError('Amount must be a finite number'));
    }

    const cents = Math.round(dollars * 100);

    const reconstructed = cents / 100;
    const diff = Math.abs(reconstructed - dollars);

    if (diff > 0.001) {
      return err(
        new ApplicationError(
          'Amount has too many decimal places (max 2 allowed)',
        ),
      );
    }

    return SignedAmount.fromCents(cents);
  }

  /**
   * Creates an Amount without validation (for hydration from persistence)
   */
  public static raw(props: Props): SignedAmount {
    return new SignedAmount(props);
  }

  /**
   * Creates an Amount from dollars (decimal)
   * @param dollars - Amount in dollars (e.g., 10.50 for $10.50)
   */

  public add(other: SignedAmount): SignedAmount {
    return new SignedAmount({ cents: this.cents + other.cents });
  }

  public equals(vo?: ValueObject<Props>): boolean {
    if (!vo || !(vo instanceof SignedAmount)) {
      return false;
    }

    return this.cents === vo.cents;
  }

  public isGreaterThan(other: SignedAmount): boolean {
    return this.cents > other.cents;
  }

  public isGreaterThanOrEqual(other: SignedAmount): boolean {
    return this.cents >= other.cents;
  }

  public isLessThan(other: SignedAmount): boolean {
    return this.cents < other.cents;
  }

  public isLessThanOrEqual(other: SignedAmount): boolean {
    return this.cents <= other.cents;
  }

  public isNegative(): boolean {
    return this.cents < 0;
  }

  public isPositive(): boolean {
    return this.cents > 0;
  }

  public isZero(): boolean {
    return this.cents === 0;
  }

  public multiply(factor: number): Result<SignedAmount> {
    Guard.number(factor);

    if (factor < 0) {
      return err(
        new ApplicationError('Multiplication factor cannot be negative'),
      );
    }

    const result = Math.round(this.cents * factor);

    return SignedAmount.fromCents(result);
  }

  public subtract(other: SignedAmount): Result<SignedAmount> {
    const result = this.cents - other.cents;

    if (result < 0) {
      return err(
        new ApplicationError('Subtraction would result in negative amount'),
      );
    }

    return ok(new SignedAmount({ cents: result }));
  }

  public toCents(): number {
    return this.cents;
  }

  public toDollars(): number {
    return this.cents / 100;
  }

  public toNegative(): SignedAmount {
    return new SignedAmount({ cents: -this.cents });
  }

  public toPositive(): SignedAmount {
    return new SignedAmount({ cents: Math.abs(this.cents) });
  }

  public toString(): string {
    return this.toDollars().toFixed(2);
  }
}
