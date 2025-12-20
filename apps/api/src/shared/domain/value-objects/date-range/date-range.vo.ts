import { ApplicationError } from '../../errors/application.error';
import { Guard } from '../../guards';
import { err, ok, Result } from '../../result';
import { ValueObject } from '../value-object.base';

interface Props {
  readonly end: Date;
  readonly start: Date;
}

/**
 * DateRange value object representing a half-open interval [start, end)
 * Used for precise date range filtering in database queries
 */
export class DateRange extends ValueObject<Props> {
  public get end(): Date {
    return this.props.end;
  }

  public get start(): Date {
    return this.props.start;
  }

  private constructor(props: Props) {
    super(props);
  }

  /**
   * Creates a DateRange from two Date objects
   * Does NOT modify the end date - assumes it's already in the correct format
   *
   * Use this when you already have the precise boundaries you want to query
   *
   * @param start - Start date (inclusive)
   * @param end - End date (exclusive)
   * @returns Result with DateRange or ApplicationError
   */
  public static fromDates(start: Date, end: Date): Result<DateRange> {
    Guard.date(start);
    Guard.date(end);

    if (isNaN(start.getTime())) {
      return err(new ApplicationError('Invalid start date'));
    }

    if (isNaN(end.getTime())) {
      return err(new ApplicationError('Invalid end date'));
    }

    if (start >= end) {
      return err(new ApplicationError('Start date must be before end date'));
    }

    return ok(new DateRange({ end, start }));
  }

  /**
   * Creates a DateRange from user-provided date strings (typically from API requests)
   * Automatically converts end date to create a half-open interval [start, end)
   *
   * This allows using gte/lt operators for precise filtering without millisecond edge cases.
   *
   * Example:
   * - User selects: Dec 19 to Dec 20
   * - Creates range: [Dec 19 00:00:00, Dec 21 00:00:00)
   * - SQL: WHERE date >= '2025-12-19 00:00:00' AND date < '2025-12-21 00:00:00'
   *
   * @param startStr - Start date string (inclusive)
   * @param endStr - End date string (inclusive in user's mind, converted to exclusive for DB)
   * @returns Result with DateRange or ApplicationError
   */
  public static fromUserInput(
    startStr: string,
    endStr: string,
  ): Result<DateRange> {
    Guard.string(startStr);
    Guard.string(endStr);

    const start = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(start.getTime())) {
      return err(new ApplicationError('Invalid start date'));
    }

    if (isNaN(end.getTime())) {
      return err(new ApplicationError('Invalid end date'));
    }

    if (start > end) {
      return err(
        new ApplicationError('Start date must be before or equal to end date'),
      );
    }

    // Convert end date to start of next day for half-open interval
    const endExclusive = new Date(end);
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

    return ok(new DateRange({ end: endExclusive, start }));
  }

  /**
   * Creates a DateRange without validation (for hydration from persistence)
   */
  public static raw(props: Props): DateRange {
    return new DateRange(props);
  }

  /**
   * Checks if a date falls within this range (inclusive start, exclusive end)
   */
  public contains(date: Date): boolean {
    return date >= this.start && date < this.end;
  }

  public equals(vo?: ValueObject<Props>): boolean {
    if (!vo || !(vo instanceof DateRange)) {
      return false;
    }

    return (
      this.start.getTime() === vo.start.getTime() &&
      this.end.getTime() === vo.end.getTime()
    );
  }

  /**
   * Returns Prisma filter object for date range queries using half-open interval
   * Use gte (>=) for start and lt (<) for end
   */
  public toPrismaFilter(): { gte: Date; lt: Date } {
    return {
      gte: this.start,
      lt: this.end,
    };
  }

  public toString(): string {
    return `[${this.start.toISOString()}, ${this.end.toISOString()})`;
  }
}
