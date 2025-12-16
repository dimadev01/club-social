import { ApplicationError } from '../../errors/application.error';
import { Guard } from '../../guards';
import { err, ok, Result } from '../../result';
import { ValueObject } from '../value-object.base';

interface Props {
  cents: number;
}

export class Amount extends ValueObject<Props> {
  public get cents(): number {
    return this.props.cents;
  }

  private constructor(props: Props) {
    super(props);
  }

  /**
   * Creates an Amount from cents (integer)
   * @param cents - Amount in cents (e.g., 1050 for $10.50)
   */
  public static fromCents(cents: number): Result<Amount> {
    Guard.number(cents);

    if (!Number.isInteger(cents)) {
      return err(new ApplicationError('Amount in cents must be an integer'));
    }

    if (!Number.isFinite(cents)) {
      return err(new ApplicationError('Amount must be a finite number'));
    }

    if (cents < 0) {
      return err(new ApplicationError('Amount cannot be negative'));
    }

    if (cents > 9_999_999_999) {
      return err(new ApplicationError('Amount exceeds maximum allowed value'));
    }

    return ok(new Amount({ cents }));
  }

  /**
   * Creates an Amount from dollars (decimal)
   * @param dollars - Amount in dollars (e.g., 10.50 for $10.50)
   */

  public static fromDollars(dollars: number): Result<Amount> {
    Guard.number(dollars);

    if (!Number.isFinite(dollars)) {
      return err(new ApplicationError('Amount must be a finite number'));
    }

    if (dollars < 0) {
      return err(new ApplicationError('Amount cannot be negative'));
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

    return Amount.fromCents(cents);
  }

  /**
   * Creates an Amount without validation (for hydration from persistence)
   */
  public static raw(props: Props): Amount {
    return new Amount(props);
  }

  public add(other: Amount): Amount {
    return new Amount({ cents: this.cents + other.cents });
  }

  public equals(vo?: ValueObject<Props>): boolean {
    if (!vo || !(vo instanceof Amount)) {
      return false;
    }

    return this.cents === vo.cents;
  }

  public isGreaterThan(other: Amount): boolean {
    return this.cents > other.cents;
  }

  public isGreaterThanOrEqual(other: Amount): boolean {
    return this.cents >= other.cents;
  }

  public isLessThan(other: Amount): boolean {
    return this.cents < other.cents;
  }

  public isLessThanOrEqual(other: Amount): boolean {
    return this.cents <= other.cents;
  }

  public isZero(): boolean {
    return this.cents === 0;
  }

  public multiply(factor: number): Result<Amount> {
    Guard.number(factor);

    if (factor < 0) {
      return err(
        new ApplicationError('Multiplication factor cannot be negative'),
      );
    }

    const result = Math.round(this.cents * factor);

    return Amount.fromCents(result);
  }

  public subtract(other: Amount): Result<Amount> {
    const result = this.cents - other.cents;

    if (result < 0) {
      return err(
        new ApplicationError('Subtraction would result in negative amount'),
      );
    }

    return ok(new Amount({ cents: result }));
  }

  public toCents(): number {
    return this.cents;
  }

  public toDollars(): number {
    return this.cents / 100;
  }

  public toString(): string {
    return this.toDollars().toFixed(2);
  }
}
