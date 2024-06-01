import { IUserEmailEntity } from '@adapters/mongo/entities/users/user-entity.interface';
import {
  IsBoolean,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UserEmailEntity implements IUserEmailEntity {
  @IsEmail()
  @IsLowercase()
  @IsNotEmpty()
  @IsString()
  public address: string;

  @IsBoolean()
  public verified: boolean;

  public constructor(props: UserEmailEntity) {
    this.address = props.address;

    this.verified = props.verified;
  }
}
