export abstract class DateVo<T = Date> {
  private _date: T;

  public constructor(date: T) {
    this._date = date;
  }

  public get date(): T {
    return this._date;
  }

  public set date(value: T) {
    this._date = value;
  }

  public abstract format(): string;
  public abstract utc(): this;
  public abstract toDate(): Date;
  public abstract toISOString(): string;
}
