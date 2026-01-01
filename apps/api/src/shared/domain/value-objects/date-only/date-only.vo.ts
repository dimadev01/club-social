import { DateFormat } from '@club-social/shared/lib';

import { ApplicationError } from '../../errors/application.error';
import { Guard } from '../../guards';
import { err, ok, Result } from '../../result';
import { ValueObject } from '../value-object.base';

interface Props {
  readonly value: string; // YYYY-MM-DD format
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class DateOnly extends ValueObject<Props> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: Props) {
    super(props);
  }

  /**
   * Creates a DateOnly from a Date object
   * Extracts only the date portion (YYYY-MM-DD) in UTC
   */
  public static fromDate(date: Date): Result<DateOnly> {
    Guard.date(date);

    if (isNaN(date.getTime())) {
      return err(new ApplicationError('Invalid date'));
    }

    return ok(new DateOnly({ value: DateOnly.toDateString(date) }));
  }

  /**
   * Creates a DateOnly from a string in YYYY-MM-DD format
   */
  public static fromString(value: string): Result<DateOnly> {
    Guard.string(value);

    if (!DATE_REGEX.test(value)) {
      return err(new ApplicationError('Date must be in YYYY-MM-DD format'));
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return err(new ApplicationError('Invalid date'));
    }

    return ok(new DateOnly({ value }));
  }

  /**
   * Creates a DateOnly without validation (for hydration from persistence)
   */
  public static raw(props: Props): DateOnly {
    return new DateOnly(props);
  }

  /**
   * Creates a DateOnly for today's date in UTC
   */
  public static today(): DateOnly {
    const value = DateFormat.today();

    return new DateOnly({ value });
  }

  private static toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public addMonths(months: number): DateOnly {
    const date = this.toDate();
    date.setUTCMonth(date.getUTCMonth() + months);

    return new DateOnly({ value: DateOnly.toDateString(date) });
  }

  public endOfMonth(): DateOnly {
    return this.startOfMonth().addMonths(1).subtractDays(1);
  }

  public equals(vo?: ValueObject<Props>): boolean {
    if (!vo || !(vo instanceof DateOnly)) {
      return false;
    }

    return this.value === vo.value;
  }

  public isAfter(other: DateOnly): boolean {
    return this.value > other.value;
  }

  public isBefore(other: DateOnly): boolean {
    return this.value < other.value;
  }

  public isInTheFuture(): boolean {
    return this.isAfter(DateOnly.today());
  }

  public isInThePast(): boolean {
    return this.isBefore(DateOnly.today());
  }

  public isSameOrAfter(other: DateOnly): boolean {
    return this.value >= other.value;
  }

  public isSameOrBefore(other: DateOnly): boolean {
    return this.value <= other.value;
  }

  public startOfMonth(): DateOnly {
    const [year, month] = this.value.split('-');

    return new DateOnly({ value: `${year}-${month}-01` });
  }

  public subtractDays(days: number): DateOnly {
    const date = this.toDate();
    date.setUTCDate(date.getUTCDate() - days);

    return new DateOnly({ value: DateOnly.toDateString(date) });
  }

  /**
   * Returns a Date object set to midnight UTC
   */
  public toDate(): Date {
    return new Date(`${this.value}T00:00:00.000Z`);
  }

  public toString(): string {
    return this.value;
  }
}
