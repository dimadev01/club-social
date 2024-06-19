export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(props: T) {
    this.value = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.value === undefined) {
      return false;
    }

    return JSON.stringify(this.value) === JSON.stringify(vo.value);
  }
}
