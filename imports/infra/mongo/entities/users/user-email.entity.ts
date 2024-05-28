import {
  IsBoolean,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UserEmailEntity {
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
