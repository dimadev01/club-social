import SimpleSchema from 'simpl-schema';
import {
  SchemaDefinitionWithShorthand,
  SchemaKeyDefinitionWithOneType,
} from 'simpl-schema/dist/esm/types';

export class SchemaBuilder {
  private _schema: SchemaKeyDefinitionWithOneType;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    this._schema = { type: '' };
  }

  public static c() {
    return new SchemaBuilder();
  }

  public autoValue(value: unknown): this {
    this._schema.autoValue = function autoValue(): unknown {
      return value;
    };

    return this;
  }

  public b() {
    return this._schema;
  }

  public date() {
    this._schema.type = Date;

    return this;
  }

  public integer() {
    this._schema.type = SimpleSchema.Integer;

    return this;
  }

  public optional() {
    this._schema.optional = true;

    this._schema.autoValue = function autoValue(): null | undefined {
      if (
        (this.isSet || this.isInsert) &&
        (this.value === undefined || this.value === null)
      ) {
        return null;
      }

      return undefined;
    };

    return this;
  }

  public schema(schema: SchemaDefinitionWithShorthand): this {
    this._schema.type = new SimpleSchema(schema);

    return this;
  }

  public string() {
    this._schema.type = String;

    return this;
  }
}
