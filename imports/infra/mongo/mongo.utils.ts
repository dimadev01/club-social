import type { Document } from 'mongodb';

export abstract class MongoUtils {
  public static first(path: string, defaultValue: string | number | boolean) {
    return { $ifNull: [{ $first: path }, defaultValue] };
  }

  public static createSearchMatch(field: string, search: string): Document {
    return { [field]: { $options: 'i', $regex: search.trim() } };
  }
}
