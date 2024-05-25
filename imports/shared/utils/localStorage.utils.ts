export abstract class LocalStorageUtils {
  public static get<T extends object>(key: string): T | undefined {
    const value = localStorage.getItem(key);

    if (!value) {
      return undefined;
    }

    return JSON.parse(value);
  }

  public static remove(key: string): void {
    localStorage.removeItem(key);
  }

  public static set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
