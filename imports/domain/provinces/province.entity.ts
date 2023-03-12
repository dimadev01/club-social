import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  validateSync,
} from 'class-validator';
import { Mongo } from 'meteor/mongo';
import { err, ok, Result } from 'neverthrow';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Province {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  governmentId: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  public static create(
    props: Mongo.OptionalId<Province>
  ): Result<Province, Error> {
    const province = new Province();

    province.governmentId = props.governmentId;

    province.latitude = props.latitude;

    province.longitude = props.longitude;

    province.name = props.name;

    const errors = validateSync(province);

    if (errors.length > 0) {
      return err(ValidationUtils.getError(errors));
    }

    return ok(province);
  }
}
