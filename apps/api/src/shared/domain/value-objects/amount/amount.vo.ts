import { ApplicationError } from '../../errors/application.error';
import { Guard } from '../../guards';
import { err, ok, Result } from '../../result';
import { SignedAmount } from './signed-amount.vo';

export class Amount extends SignedAmount {
  /**
   * Creates an Amount from cents (integer)
   * @param cents - Amount in cents (e.g., 1050 for $10.50)
   */
  public static fromCents(cents: number): Result<Amount> {
    Guard.number(cents);

    // First validate base class
    const signedAmount = SignedAmount.fromCents(cents);

    if (signedAmount.isErr()) {
      return err(signedAmount.error);
    }

    if (cents < 0) {
      return err(new ApplicationError('Amount cannot be negative'));
    }

    return ok(new Amount({ cents }));
  }

  public static fromDollars(dollars: number): Result<Amount> {
    Guard.number(dollars);

    if (dollars < 0) {
      return err(new ApplicationError('Amount cannot be negative'));
    }

    return SignedAmount.fromDollars(dollars);
  }
}
